"use strict";

const request = require("supertest");
const app = require("../app");
const db = require("../db");

const companies = [
  { code: "mac", name: "APPLE", description: "apple company" },
];

beforeEach(async function () {
  await db.query("DELETE FROM companies");
  for (const company of companies) {
    await db.query(
      `INSERT INTO companies (code, name, description)
        VALUES ($1, $2, $3)
        `,
      [company.code, company.name, company.description]
    );
  }
});

afterEach(async function () {});

describe("GET /companies", function () {
  test("Gets a list of 2 companies", async function () {
    const resp = await request(app).get(`/companies`);
    expect(resp.body).toEqual({
      companies: [{ code: "mac", name: "APPLE" }],
    });
  });
});

describe("GET /companies/[code]", function () {
  test("Gets a company by its code", async function () {
    const resp = await request(app).get(`/companies/mac`);
    expect(resp.body).toEqual({
      company: {
        code: "mac",
        name: "APPLE",
        description: "apple company",
        invoices: [],
      },
    });
  });

  test("We don't get a company if not valid code", async function () {
    const resp = await request(app).get(`/companies/MAC`);
    expect(resp.statusCode).toEqual(404);
  });
});
