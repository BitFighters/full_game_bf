import { PerIndexOptions } from "@aws/dynamodb-data-mapper";

export default class GlobalSecondaryIndex {
  public static global_secondary_indices = {} as PerIndexOptions;
}
