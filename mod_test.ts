import { assertEquals } from "https://deno.land/std@0.127.0/testing/asserts.ts";

import { Equal, Expect } from "./test_utils.ts";
import { Camelize, camelize, CamelizeDeep, camelizeDeep } from "./mod.ts";

// Type Checks
type cases = [
  Expect<Equal<Camelize<"id">, "id">>,
  Expect<Equal<Camelize<"user_id">, "userId">>,
  Expect<Equal<Camelize<"test-company-123">, "testCompany123">>,
  Expect<Equal<CamelizeDeep<{ user_id: string }>, { userId: string }>>,
  Expect<
    Equal<
      CamelizeDeep<{
        id: number;
        bookings: {
          booking_id: number;
          is_confirmed: boolean;
        }[];
      }>,
      {
        id: number;
        bookings: {
          bookingId: number;
          isConfirmed: boolean;
        }[];
      }
    >
  >,
];

// Conversion Checks
Deno.test("camelize", () => {
  const camelized = camelize("abc_def-ghi.j123");
  assertEquals(camelized, "abcDefGhiJ123");
});

Deno.test("camelizeDeep: Object with Array", () => {
  assertEquals(
    camelizeDeep({
      user_id: 123,
      bookings: [
        {
          booking_id: 1,
          is_confirmed: true,
        },
        {
          booking_id: 2,
          is_confirmed: false,
        },
      ],
    }),
    {
      userId: 123,
      bookings: [
        {
          bookingId: 1,
          isConfirmed: true,
        },
        {
          bookingId: 2,
          isConfirmed: false,
        },
      ],
    },
  );
});

Deno.test("camelizeDeep: Object with Date instance", () => {
  assertEquals(
    camelizeDeep({
      created_at: new Date("2022-01-31T12:00:00.000"),
    }),
    {
      createdAt: new Date("2022-01-31T12:00:00.000"),
    },
  );
});
