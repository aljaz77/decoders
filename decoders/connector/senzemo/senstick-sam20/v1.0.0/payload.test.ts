import { describe, expect, test, beforeEach } from "vitest";
import { DataToSend } from "@tago-io/sdk";

import { decoderRun } from "../../../../../src/functions/decoder-run";

const file_path = "decoders/connector/senzemo/senstick-sam20/v1.0.0/payload.ts";

let payload: DataToSend[] = [];

describe("Senstick SAM20 - alert packet decode", () => {
  beforeEach(() => {
    payload = [
      { variable: "payload_raw", value: "01" },
      { variable: "port", value: 1 },
    ];
    payload = decoderRun(file_path, { payload });
  });

  test("Decodes alert correctly", () => {
    const alert = payload.find((x) => x.variable === "alert");
    expect(alert?.value).toBe(1);
  });

  test("Decodes move_detected correctly", () => {
    const move_detected = payload.find((x) => x.variable === "move_detected");
    expect(move_detected?.value).toBe(true);
  });
});

describe("Senstick SAM20 - data packet decode (no status, 8 bytes)", () => {
  beforeEach(() => {
    payload = [
      { variable: "payload_raw", value: "092e119427940e10" },
      { variable: "port", value: 2 },
    ];
    payload = decoderRun(file_path, { payload });
  });

  test("Output is an array", () => {
    expect(Array.isArray(payload)).toBe(true);
  });

  test("Decodes status correctly", () => {
    const status = payload.find((x) => x.variable === "status");
    expect(status?.value).toBe(0);
  });

  test("Decodes temperature correctly", () => {
    const temperature = payload.find((x) => x.variable === "temperature");
    expect(temperature?.value).toBe(23.5);
  });

  test("Decodes humidity correctly", () => {
    const humidity = payload.find((x) => x.variable === "humidity");
    expect(humidity?.value).toBe(45);
  });

  test("Decodes air pressure correctly", () => {
    const air_pressure = payload.find((x) => x.variable === "air_pressure");
    expect(air_pressure?.value).toBe(1013.2);
  });

  test("Decodes battery level correctly", () => {
    const battery_level = payload.find((x) => x.variable === "battery_level");
    expect(battery_level?.value).toBe(3600);
  });

  test("Decodes debug_firmware as false on port 2", () => {
    const debug_firmware = payload.find((x) => x.variable === "debug_firmware");
    expect(debug_firmware?.value).toBe(false);
  });

  test("Does not include logging fields", () => {
    const log_fcnt = payload.find((x) => x.variable === "log_fcnt");
    expect(log_fcnt).toBeUndefined();
  });
});

describe("Senstick SAM20 - data packet decode (with status, 9 bytes, negative temperature, debug firmware)", () => {
  beforeEach(() => {
    payload = [
      { variable: "payload_raw", value: "01ff9c177026de0ce4" },
      { variable: "port", value: 4 },
    ];
    payload = decoderRun(file_path, { payload });
  });

  test("Decodes status correctly", () => {
    const status = payload.find((x) => x.variable === "status");
    expect(status?.value).toBe(1);
  });

  test("Decodes negative temperature correctly", () => {
    const temperature = payload.find((x) => x.variable === "temperature");
    expect(temperature?.value).toBe(-1);
  });

  test("Decodes humidity correctly", () => {
    const humidity = payload.find((x) => x.variable === "humidity");
    expect(humidity?.value).toBe(60);
  });

  test("Decodes air pressure correctly", () => {
    const air_pressure = payload.find((x) => x.variable === "air_pressure");
    expect(air_pressure?.value).toBe(995);
  });

  test("Decodes battery level correctly", () => {
    const battery_level = payload.find((x) => x.variable === "battery_level");
    expect(battery_level?.value).toBe(3300);
  });

  test("Decodes debug_firmware as true on port 4", () => {
    const debug_firmware = payload.find((x) => x.variable === "debug_firmware");
    expect(debug_firmware?.value).toBe(true);
  });
});

describe("Senstick SAM20 - data packet decode with trailing logging record (20 bytes)", () => {
  beforeEach(() => {
    payload = [
      { variable: "payload_raw", value: "092e119427940e100000050207d0138827740dac" },
      { variable: "port", value: 2 },
    ];
    payload = decoderRun(file_path, { payload });
  });

  test("Decodes primary temperature correctly", () => {
    const temperature = payload.find((x) => x.variable === "temperature");
    expect(temperature?.value).toBe(23.5);
  });

  test("Decodes log_fcnt correctly", () => {
    const log_fcnt = payload.find((x) => x.variable === "log_fcnt");
    expect(log_fcnt?.value).toBe(5);
  });

  test("Decodes log_status correctly", () => {
    const log_status = payload.find((x) => x.variable === "log_status");
    expect(log_status?.value).toBe(2);
  });

  test("Decodes log_temperature correctly", () => {
    const log_temperature = payload.find((x) => x.variable === "log_temperature");
    expect(log_temperature?.value).toBe(20);
  });

  test("Decodes log_humidity correctly", () => {
    const log_humidity = payload.find((x) => x.variable === "log_humidity");
    expect(log_humidity?.value).toBe(50);
  });

  test("Decodes log_air_pressure correctly", () => {
    const log_air_pressure = payload.find((x) => x.variable === "log_air_pressure");
    expect(log_air_pressure?.value).toBe(1010);
  });

  test("Decodes log_battery_level correctly", () => {
    const log_battery_level = payload.find((x) => x.variable === "log_battery_level");
    expect(log_battery_level?.value).toBe(3500);
  });
});

describe("Senstick SAM20 - config packet decode (port 3)", () => {
  beforeEach(() => {
    payload = [
      { variable: "payload_raw", value: "013c0a018507030a15" },
      { variable: "port", value: 3 },
    ];
    payload = decoderRun(file_path, { payload });
  });

  test("Decodes status correctly", () => {
    const status = payload.find((x) => x.variable === "status");
    expect(status?.value).toBe(1);
  });

  test("Decodes send_period correctly", () => {
    const send_period = payload.find((x) => x.variable === "send_period");
    expect(send_period?.value).toBe(60);
  });

  test("Decodes movement_threshold correctly", () => {
    const movement_threshold = payload.find((x) => x.variable === "movement_threshold");
    expect(movement_threshold?.value).toBe(10);
  });

  test("Decodes packet_confirm correctly", () => {
    const packet_confirm = payload.find((x) => x.variable === "packet_confirm");
    expect(packet_confirm?.value).toBe(1);
  });

  test("Decodes adr_on correctly", () => {
    const adr_on = payload.find((x) => x.variable === "adr_on");
    expect(adr_on?.value).toBe(true);
  });

  test("Decodes data_rate correctly", () => {
    const data_rate = payload.find((x) => x.variable === "data_rate");
    expect(data_rate?.value).toBe(5);
  });

  test("Decodes family_id correctly", () => {
    const family_id = payload.find((x) => x.variable === "family_id");
    expect(family_id?.value).toBe(7);
  });

  test("Decodes product_id correctly", () => {
    const product_id = payload.find((x) => x.variable === "product_id");
    expect(product_id?.value).toBe(3);
  });

  test("Decodes hw_version correctly", () => {
    const hw_version = payload.find((x) => x.variable === "hw_version");
    expect(hw_version?.value).toBe(1);
  });

  test("Decodes fw_version correctly", () => {
    const fw_version = payload.find((x) => x.variable === "fw_version");
    expect(fw_version?.value).toBe(2.1);
  });
});

describe("Shall not be parsed", () => {
  beforeEach(() => {
    payload = [{ variable: "shallnotpass", value: "04096113950292" }];
    payload = decoderRun(file_path, { payload });
  });

  test("Output Result", () => {
    expect(Array.isArray(payload)).toBe(true);
  });

  test("Not parsed Result", () => {
    expect(payload).toEqual([{ variable: "shallnotpass", value: "04096113950292" }]);
  });
});
