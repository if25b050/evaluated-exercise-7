import { expect, test } from "@jest/globals";

test("POST users returns 201 for created user entity", async () => {
  const res = await fetch("http://localhost:5000/api/v1/users", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Mi Yu",
      email: `miyu${Math.random()}@gmail.com`,
    }),
  });
  expect(res.status).toBe(201);
});

test("POST users returns 400 for invalid email", async () => {
  const res = await fetch("http://localhost:5000/api/v1/users", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Mi Yu",
      email: `miyu${Math.random()}@.com`,
    }),
  });

  expect(res.status).toBe(400);
});
