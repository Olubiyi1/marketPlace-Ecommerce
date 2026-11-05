import { jest } from "@jest/globals";
import { Role } from "../../generated/prisma/enums.js";

// 1. Register the fakes BEFORE loading the code that uses them
jest.unstable_mockModule("../User/user.service.js", () => ({
  default: {
    getUserByEmail: jest.fn(),
    createUser: jest.fn(),
  },
}));

jest.unstable_mockModule("../../config/redis.config.js", () => ({
  default: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  },
}));
jest.unstable_mockModule("../Queues/emailVerification.queue.js", () => ({
  default: { add: jest.fn() },
}));

jest.unstable_mockModule("../../Guards/guards.js", () => ({
  default: {
    hashPassword: jest.fn(),
    verifyPassword: jest.fn(),
  },
}));

jest.unstable_mockModule(
  "../../Helpers/redis.emailVerification.helper.js",
  () => ({
    default: {
      setVerificationToken: jest.fn(),
      getVerificationToken: jest.fn(),
      deleteVerificationToken: jest.fn(),
    },
  }),
);

jest.unstable_mockModule("../../Helpers/token.helper.js", () => ({
  generateToken: jest.fn(),
  hashToken: jest.fn(),
}));

// 2. Now load the modules (they will receive the fakes)
const { default: userService } = await import("../User/user.service.js");
const { default: authService } = await import("./auth.service.js");
const { default: Guards } = await import("../../Guards/guards.js");
const { default: redisEmailVerificationHelper } =
  await import("../../Helpers/redis.emailVerification.helper.js");
const { generateToken, hashToken } =
  await import("../../Helpers/token.helper.js");
const { default: emailVerificationQueue } =
  await import("../../Modules/Queues/emailVerification.queue.js");

describe("registerUser", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  // check for exisitng user
  test("should throw an error if email already exists", async () => {
    const existingUser = {
      id: "user-1",
      email: "existing@gmail.com",
      firstName: "jide",
      lastName: "john",
      password: "hashed-password",
      role: Role.CUSTOMER,
      verifiedAt: null,
      profilePicture: null,
      phoneNumber: "12345432",
      isActive: true,
      createAt: new Date(),
      updatedAt: new Date(),
    };

    jest.mocked(userService.getUserByEmail).mockResolvedValue(existingUser);

    await expect(
      authService.registerUser({
        firstName: "Test",
        lastName: "User",
        email: "existing@gmail.com",
        password: "Password123!",
        phoneNumber: "08012345678",
      }),
    ).rejects.toMatchObject({ statusCode: 409 });

    expect(userService.getUserByEmail).toHaveBeenCalledWith(
      "existing@gmail.com",
    );
    expect(userService.createUser).not.toHaveBeenCalled();
  });

  // create new user

  it("should create new user", async () => {
    const newUser = {
      id: "user-1",
      email: "existing@gmail.com",
      firstName: "jide",
      lastName: "john",
      password: "Password123!",
      role: Role.CUSTOMER,
      verifiedAt: null,
      profilePicture: null,
      phoneNumber: "12345432",
      isActive: true,
      createAt: new Date(),
      updatedAt: new Date(),
    };

    jest.mocked(userService.getUserByEmail).mockResolvedValue(null);
    jest.mocked(Guards.hashPassword).mockResolvedValue("hashedPassword");
    jest.mocked(userService.createUser).mockResolvedValue(newUser);
    jest.mocked(generateToken).mockReturnValue("raw-token");
    jest.mocked(hashToken).mockReturnValue("hashed-token");
    jest.mocked(redisEmailVerificationHelper.setVerificationToken).mockResolvedValue(undefined);
    jest.mocked(emailVerificationQueue.add).mockResolvedValue({} as any);

    await expect(
      authService.registerUser({
        firstName: "Test",
        lastName: "User",
        email: "existing@gmail.com",
        password: "Password123!",
        phoneNumber: "08012345678",
      }),
    ).resolves.toEqual(newUser);

    expect(userService.getUserByEmail).toHaveBeenCalledWith(
      "existing@gmail.com",
    );
    expect(generateToken).toHaveBeenCalledTimes(1);
    expect(hashToken).toHaveBeenCalledWith("raw-token");
    expect(redisEmailVerificationHelper.setVerificationToken).toHaveBeenCalledWith("hashed-token", newUser.email);
    expect(emailVerificationQueue.add).toHaveBeenCalledWith(
      "send-verification-email",
      {
        email: newUser.email,
        token: "raw-token",
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
      },
    );

    expect(userService.createUser).toHaveBeenCalledTimes(1);
    expect(userService.createUser).toHaveBeenCalledWith({
      firstName: "Test",
      lastName: "User",
      email: "existing@gmail.com",
      password: "hashedPassword",
      phoneNumber: "08012345678",
    });
  });

  // hash password before creating user
  it("should hash password before creating a user", async () => {
    const hashedPassword = "hashedPassword";
    const newUser = {
      id: "user-1",
      email: "existing@gmail.com",
      firstName: "jide",
      lastName: "john",
      password: hashedPassword,
      role: Role.CUSTOMER,
      verifiedAt: null,
      profilePicture: null,
      phoneNumber: "12345432",
      isActive: true,
      createAt: new Date(),
      updatedAt: new Date(),
    };
    jest.mocked(userService.getUserByEmail).mockResolvedValue(null);
    jest.mocked(Guards.hashPassword).mockResolvedValue(hashedPassword);
    jest.mocked(userService.createUser).mockResolvedValue(newUser);

    await authService.registerUser({
      firstName: "Test",
      lastName: "User",
      email: "existing@gmail.com",
      password: "Password123!",
      phoneNumber: "08012345678",
    });
    expect(Guards.hashPassword).toHaveBeenCalledWith("Password123!");
    expect(userService.createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        password: hashedPassword,
      }),
    );
  });

  // database creation failure
  it("should throw an error if user creation fails",async()=>{
    jest.mocked(userService.getUserByEmail).mockResolvedValue(null)
    jest.mocked(Guards.hashPassword).mockResolvedValue("hashedPassword")
    jest.mocked(userService.createUser).mockRejectedValue(new Error("Database creation failed"));

    await expect(authService.registerUser({
      firstName: "Test",
      lastName: "User",
      email: "existing@gmail.com",
      password: "Password123!",
      phoneNumber: "08012345678",
    })).rejects.toThrow("Database creation failed")

    expect(userService.createUser).toHaveBeenCalledTimes(1)
    expect(generateToken).not.toHaveBeenCalled()
    expect(redisEmailVerificationHelper.setVerificationToken).not.toHaveBeenCalled()
    expect(emailVerificationQueue.add).not.toHaveBeenCalled()
  })

  // redis failure test
it("should throw an error if redis fails", async () => {
  const newUser = {
    id: "user-1",
    email: "existing@gmail.com",
    firstName: "jide",
    lastName: "john",
    password: "hashedPassword",
    role: Role.CUSTOMER,
    verifiedAt: null,
    profilePicture: null,
    phoneNumber: "12345432",
    isActive: true,
    createAt: new Date(),
    updatedAt: new Date(),
  };

  jest.mocked(userService.getUserByEmail).mockResolvedValue(null);
  jest.mocked(Guards.hashPassword).mockResolvedValue("hashedPassword");
  jest.mocked(userService.createUser).mockResolvedValue(newUser);
  jest.mocked(generateToken).mockReturnValue("raw-token");
  jest.mocked(hashToken).mockReturnValue("hashed-token");
  jest.mocked(redisEmailVerificationHelper.setVerificationToken).mockRejectedValue(new Error("Redis connection failed"));

  await expect(
    authService.registerUser({
      firstName: "Test",
      lastName: "User",
      email: "existing@gmail.com",
      password: "Password123!",
      phoneNumber: "08012345678",
    }),
  ).rejects.toThrow("Redis connection failed");

  expect(userService.createUser).toHaveBeenCalledTimes(1);

  expect(redisEmailVerificationHelper.setVerificationToken,).toHaveBeenCalledWith("hashed-token", newUser.email);

  expect(emailVerificationQueue.add).not.toHaveBeenCalled();
});

});
