export interface ListCommandsResponse {
  // Deprecated, use ``commands`` instead
  entry?: CommandHistoryEntry[];

  // Page  of matching commands
  commands: CommandHistoryEntry[];

  // Token indicating the response is only partial. More results can then
  // be obtained by performing the same request (including all original
  // query parameters) and setting the ``next`` parameter to this token.
  continuationToken?: string;
}

export interface CommandHistoryEntry {
  id: string;

  // Qualified name
  commandName: string;

  // Name aliases keyed by namespace.
  // (as currently present in Mission Database)
  aliases: { [key: string]: string };
  origin: string;
  sequenceNumber: number;
  commandId: CommandId;
  attr: CommandHistoryAttribute[];
  generationTime: string; // RFC 3339 timestamp
  assignments: CommandAssignment[];
}

interface CommandId {
  generationTime: string; // String decimal
  origin: string;
  sequenceNumber: number;
  commandName: string;
}

interface CommandHistoryAttribute {
  name: string;
  value: Value;
  time: string; // String decimal
}

// Union type for storing a value
interface Value {
  type: Type;
  floatValue: number;
  doubleValue: number;
  sint32Value: number;
  uint32Value: number;
  binaryValue: string; // Base64
  stringValue: string;
  timestampValue: string; // String decimal
  uint64Value: string; // String decimal
  sint64Value: string; // String decimal
  booleanValue: boolean;
  aggregateValue: AggregateValue;
  arrayValue: Value[];
}

// An aggregate value is an ordered list of (member name, member value).
// Two arrays are used in order to be able to send just the values (since
// the names will not change)
interface AggregateValue {
  name: string[];
  value: Value[];
}

interface CommandAssignment {
  name: string;
  value: Value;
  userInput: boolean;
}

enum Type {
  FLOAT = "FLOAT",
  DOUBLE = "DOUBLE",
  UINT32 = "UINT32",
  SINT32 = "SINT32",
  BINARY = "BINARY",
  STRING = "STRING",
  TIMESTAMP = "TIMESTAMP",
  UINT64 = "UINT64",
  SINT64 = "SINT64",
  BOOLEAN = "BOOLEAN",
  AGGREGATE = "AGGREGATE",
  ARRAY = "ARRAY",

  // Enumerated values have both an integer (sint64Value) and a string representation
  ENUMERATED = "ENUMERATED",
  NONE = "NONE",
}

export interface TimeSeries {
  // List of samples.
  sample: Sample[];
}

export interface Sample {
  // Start time of the sample interval.
  time: string; // RFC 3339 timestamp

  // Average numeric value during the sample interval.
  avg: number;

  // Minimum numeric value during the sample interval.
  min: number;

  // Maximum numeric value during the sample interval.
  max: number;

  // Number of samples during the sample interval.
  // If this value is zero, it indicates a gap.
  n: number;

  // Generation time of the ``min`` value.
  minTime: string; // RFC 3339 timestamp

  // Generation time of the ``max`` value.
  maxTime: string; // RFC 3339 timestamp
}
