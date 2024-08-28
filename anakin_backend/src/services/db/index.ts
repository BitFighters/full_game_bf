import { mapper } from "./connection";
import models from "@models/all";
import { ANAKIN_LOGGER } from "@services/logger";

export async function ensureTablesExist() {
  for await (let model of models) {
    try {
      await mapper
        .ensureTableExists(model, {
          readCapacityUnits: 5,
          writeCapacityUnits: 5,
          ...(model["global_secondary_indices"] && {
            indexOptions: model["global_secondary_indices"],
          }),
        });
      ANAKIN_LOGGER.info(`Table ${model.name} exits or created.`);
    } catch (e) {
      ANAKIN_LOGGER.error(`Failed to ensure existence of tables ${model.name}`, e);
      throw e;
    }
  }
}
