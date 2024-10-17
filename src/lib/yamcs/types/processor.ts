export interface IssueCommandResponse {
  /**
   * Command ID
   */
  id: string;

  /**
   * Command generation time
   * Format: RFC 3339 timestamp
   */
  generationTime: string; // RFC 3339 timestamp

  /**
   * The origin of the command. Typically a hostname.
   */
  origin: string;

  /**
   * The sequence number for the origin
   */
  sequenceNumber: number;

  /**
   * Qualified name
   */
  commandName: string;

  /**
   * Name aliases keyed by namespace.
   * (as currently present in Mission Database)
   */
  aliases: Record<string, string>;

  /**
   * The name/value assignments for this command
   */
  assignments: CommandAssignment[];

  /**
   * Generated binary, before any link post-processing
   * Format: Base64
   */
  unprocessedBinary: string; // Base64

  /**
   * Generated binary, after link post-processing.
   * The differences compared to `unprocessedBinary`,
   * can be anything. Typical manipulations include
   * sequence numbers or checksum calculations.
   * Format: Base64
   */
  binary: string; // Base64

  /**
   * Command issuer
   */
  username: string;

  /**
   * Queue that was selected for this command
   */
  queue: string;
}

interface CommandAssignment {
  name: string;
  value: Value;
  userInput: boolean;
}

export interface IssueCommandRequest {
  /**
   * The name/value assignments for this command.
   */
  args: Record<string, any>;

  /**
   * The origin of the command. Typically a hostname.
   */
  origin: string;

  /**
   * The sequence number as specified by the origin. This gets
   * communicated back in command history and command queue entries,
   * thereby allowing clients to map local with remote command
   * identities.
   */
  sequenceNumber: number;

  /**
   * Whether a response will be returned without actually issuing
   * the command. This is useful when debugging commands.
   * Default: `no`
   */
  dryRun: boolean;

  /**
   * Comment attached to this command.
   */
  comment: string;

  /**
   * Override the stream on which the command should be sent out.
   * Requires elevated privilege.
   */
  stream: string;

  /**
   * Disable verification of all transmission constraints (if any
   * specified in the MDB). Requires elevated privilege.
   */
  disableTransmissionConstraints: boolean;

  /**
   * Disable all post transmission verifiers (if any specified in the MDB).
   * Requires elevated privilege.
   */
  disableVerifiers: boolean;

  /**
   * Override verifier configuration. Keyed by verifier name.
   * Requires elevated privilege.
   */
  // verifierConfig: Record<string, VerifierConfig>;

  /**
   * Specify custom options for interpretation by non-core extensions.
   * Extensions must register these options against org.yamcs.YamcsServer.
   */
  extra: Record<string, Value>;
}

export interface Value {
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
