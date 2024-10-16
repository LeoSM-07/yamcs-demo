export interface ListParametersResponse {
  // Matching subsystems when the ``system`` option was specified
  systems: SpaceSystemInfo[];

  // Deprecated. Use ``systems`` instead
  spaceSystems: string[];

  // Matching parameters
  parameters: ParameterInfo[];

  // Token indicating the response is only partial. More results can then
  // be obtained by performing the same request (including all original
  // query parameters) and setting the ``next`` parameter to this token.
  continuationToken: string;

  // The total number of results (across all pages)
  totalSize: number;
}

export interface MissionDatabase {
  // This is the config section in mdb.yaml
  configName: string;

  // Root space-system name
  name: string;

  // Root space-system header version
  version: string;

  // Deprecated, use ``spaceSystems`` instead
  spaceSystem: SpaceSystemInfo[];
  spaceSystems: SpaceSystemInfo[];
  parameterCount: number;
  containerCount: number;
  commandCount: number;
  algorithmCount: number;
  parameterTypeCount: number;
}

export interface CommandInfo {
  name: string;
  qualifiedName: string;
  shortDescription: string;
  longDescription: string;
  alias: NamedObjectId[];
  baseCommand: CommandInfo;
  abstract: boolean;
  argument: ArgumentInfo[];
  argumentAssignment: ArgumentAssignmentInfo[];

  // Command significance.
  //
  // This is the significance defined specifically for this command.
  // If unset, there may still be a significance inherited from
  // a base command.
  significance: SignificanceInfo;
  constraint: TransmissionConstraintInfo[];
  commandContainer: CommandContainerInfo;
  verifier: VerifierInfo[];
  // ancillaryData: { [key: string]: AncillaryDataInfo };

  // Effective command significance.
  //
  // This is the significance obtained by looking up the first defined
  // significance either in this command, or the nearest base command.
  effectiveSignificance: SignificanceInfo;
}

export interface ListCommandsResponse {
  // Matching subsystems when the ``system`` option was specified
  systems: SpaceSystemInfo[];

  // Deprecated. Use ``systems`` instead
  spaceSystems: string[];

  // Matching commands
  commands: CommandInfo[];

  // Token indicating the response is only partial. More results can then
  // be obtained by performing the same request (including all original
  // query parameters) and setting the ``next`` parameter to this token.
  continuationToken: string;

  // The total number of results (across all pages)
  totalSize: number;
}

export interface SpaceSystemInfo {
  // Space system name
  name: string;
  qualifiedName: string;

  // Short description (one line)
  shortDescription: string;

  // Long description (Markdown)
  longDescription: string;
  alias: NamedObjectId[];
  version: string;
  history: HistoryInfo[];
  sub: SpaceSystemInfo[];
  // ancillaryData: { [key: string]: AncillaryDataInfo };
}

// Used by external clients to identify an item in the Mission Database
// If namespace is set, then the name is that of an alias, rather than
// the qualified name.
export interface NamedObjectId {
  name: string;
  namespace: string;
}

export interface HistoryInfo {
  version: string;
  date: string;
  message: string;
  author: string;
}

export interface CommandInfo {
  name: string;
  qualifiedName: string;
  shortDescription: string;
  longDescription: string;
  alias: NamedObjectId[];
  baseCommand: CommandInfo;
  abstract: boolean;
  argument: ArgumentInfo[];
  argumentAssignment: ArgumentAssignmentInfo[];

  // Command significance.
  //
  // This is the significance defined specifically for this command.
  // If unset, there may still be a significance inherited from
  // a base command.
  significance: SignificanceInfo;
  constraint: TransmissionConstraintInfo[];
  commandContainer: CommandContainerInfo;
  verifier: VerifierInfo[];
  // ancillaryData: { [key: string]: AncillaryDataInfo };

  // Effective command significance.
  //
  // This is the significance obtained by looking up the first defined
  // significance either in this command, or the nearest base command.
  effectiveSignificance: SignificanceInfo;
}

export interface ArgumentInfo {
  name: string;
  description: string;
  initialValue: string;
  type: ArgumentTypeInfo;
}

export interface ArgumentTypeInfo {
  engType: string;
  dataEncoding: DataEncodingInfo;
  unitSet: UnitInfo[];

  // Enumeration states (only used by enumerated arguments)
  enumValue: EnumValue[];

  // Minimum value (only used by integer and float arguments)
  rangeMin: number;

  // Maximum value (only used by integer and float arguments)
  rangeMax: number;

  // Member information (only used by aggregate arguments)
  member: ArgumentMemberInfo[];

  // String representation of a boolean zero (only used by boolean arguments)
  zeroStringValue: string;

  // String representation of a boolean one (only used by boolean arguments)
  oneStringValue: string;

  // Minimum character count (only used by string arguments)
  minChars: number;

  // Maximum character count (only used by string arguments)
  maxChars: number;

  // True if the engineering type supports signed representation.
  // (only used by integer arguments)
  signed: boolean;

  // Minimum byte count (only used by binary arguments)
  minBytes: number;

  // Maximum character count (only used by binary arguments)
  maxBytes: number;

  // Length of each dimension (only used by array arguments)
  dimensions: ArgumentDimensionInfo[];

  // Type of array entries (only used by array arguments)
  elementType: ArgumentTypeInfo;

  // Name of the parameter type
  name: string;
}

export interface DataEncodingInfo {
  type: Type;
  littleEndian: boolean;
  sizeInBits: number;
  encoding: string;
  defaultCalibrator: CalibratorInfo;

  // Deprecated, use ``contextCalibrators`` instead
  contextCalibrator: ContextCalibratorInfo[];
  contextCalibrators: ContextCalibratorInfo[];
}

export interface CalibratorInfo {
  polynomialCalibrator: PolynomialCalibratorInfo;
  splineCalibrator: SplineCalibratorInfo;
  javaExpressionCalibrator: JavaExpressionCalibratorInfo;
  type: Type;
}

export interface PolynomialCalibratorInfo {
  // Deprecated, use ``coefficients`` instead
  coefficient: number[];
  coefficients: number[];
}

export interface SplineCalibratorInfo {
  // Deprecated, use ``points`` instead
  point: SplinePointInfo[];
  points: SplinePointInfo[];
}

export interface SplinePointInfo {
  raw: number;
  calibrated: number;
}

export interface JavaExpressionCalibratorInfo {
  formula: string;
}

export interface ContextCalibratorInfo {
  comparison: ComparisonInfo[];
  calibrator: CalibratorInfo;

  // This can be used in UpdateParameterRequest to pass a context
  // that is parsed on the server, according to the rules in the
  // excel spreadsheet. Either this or a comparison has to be
  // used (not both at the same time)
  context: string;
}

export interface ComparisonInfo {
  parameter: ParameterInfo;
  operator: OperatorType;
  value: string;
  argument: ArgumentInfo;
}

export interface ParameterInfo {
  name: string;
  qualifiedName: string;
  shortDescription: string;
  longDescription: string;
  alias: NamedObjectId[];
  type: ParameterTypeInfo;
  dataSource: DataSourceType;
  usedBy: UsedByInfo;
  // ancillaryData: { [key: string]: AncillaryDataInfo };

  // Operations that return aggregate members or array entries
  // may use this field to indicate the path within the parameter.
  path: string[];
}

export interface ParameterTypeInfo {
  name: string;
  qualifiedName: string;
  shortDescription: string;
  longDescription: string;
  alias: NamedObjectId[];

  // Engineering type
  engType: string;
  dataEncoding: DataEncodingInfo;
  unitSet: UnitInfo[];

  // Default Alarm, effective when no contextual alarm takes precedence.
  defaultAlarm: AlarmInfo;
  enumValue: EnumValue[];
  absoluteTimeInfo: AbsoluteTimeInfo;

  // Contextual alarms
  contextAlarm: ContextAlarmInfo[];
  member: MemberInfo[];
  arrayInfo: ArrayInfo;
  // ancillaryData: { [key: string]: AncillaryDataInfo };

  // Provides hints on how to format the engineering
  // value as a string.
  numberFormat: NumberFormatTypeInfo;

  // True if the engineering type supports signed representation.
  // (only used by integer parameter types)
  signed: boolean;

  // Hint about the range of allowed engineering values
  sizeInBits: number;

  // String representation of a boolean zero (only used by boolean types)
  zeroStringValue: string;

  // String representation of a boolean one (only used by boolean types)
  oneStringValue: string;

  // Which parameters this type is used by. This field is only
  // populated when requesting directly a single parameter type.
  usedBy: ParameterInfo[];
}

export interface UnitInfo {
  unit: string;
}

export interface AlarmInfo {
  minViolations: number;

  // Deprecated, use ``staticAlarmRanges`` instead
  staticAlarmRange: AlarmRange[];
  staticAlarmRanges: AlarmRange[];

  // Deprecated, use ``enumerationAlarms`` instead
  enumerationAlarm: EnumerationAlarm[];
  enumerationAlarms: EnumerationAlarm[];
}

export interface AlarmRange {
  level: AlarmLevelType;
  minInclusive: number;
  maxInclusive: number;
  minExclusive: number;
  maxExclusive: number;
}

export interface EnumerationAlarm {
  level: AlarmLevelType;
  label: string;
}

export interface EnumValue {
  value: string; // String decimal
  label: string;
  description: string;
}

export interface AbsoluteTimeInfo {
  initialValue: string;
  scale: number;
  offset: number;
  offsetFrom: ParameterInfo;
  epoch: string;
}

export interface ContextAlarmInfo {
  comparison: ComparisonInfo[];
  alarm: AlarmInfo;

  // This can be used in UpdateParameterRequest to pass a context
  // that is parsed on the server, according to the rules in the
  // excel spreadsheet. Either this or a comparison has to be
  // used (not both at the same time)
  context: string;
}

export interface MemberInfo {
  name: string;
  shortDescription: string;
  longDescription: string;
  alias: NamedObjectId[];
  type: ParameterTypeInfo;
}

export interface ArrayInfo {
  type: ParameterTypeInfo;
  dimensions: ParameterDimensionInfo[];
}

export interface ParameterDimensionInfo {
  fixedValue: string; // String decimal
  parameter: ParameterInfo;
  slope: string; // String decimal
  intercept: string; // String decimal
}

export interface NumberFormatTypeInfo {
  numberBase: string;
  minimumFractionDigits: number;
  maximumFractionDigits: number;
  minimumIntegerDigits: number;
  maximumIntegerDigits: number;
  negativeSuffix: string;
  positiveSuffix: string;
  negativePrefix: string;
  positivePrefix: string;
  showThousandsGrouping: boolean;
  notation: string;
}

export interface UsedByInfo {
  algorithm: AlgorithmInfo[];
  container: ContainerInfo[];
}

export interface AlgorithmInfo {
  // Algorithm name
  name: string;
  qualifiedName: string;
  shortDescription: string;
  longDescription: string;
  alias: NamedObjectId[];
  scope: Scope;

  // Type of algorithm
  type: Type;

  // Language if this is a custom algorithm
  language: string;

  // Code if this is a custom algorithm
  text: string;
  inputParameter: InputParameterInfo[];
  outputParameter: OutputParameterInfo[];
  onParameterUpdate: ParameterInfo[];
  onPeriodicRate: string[]; // String decimal

  // Operands and operators in Reverse Polish Notation if type ``MATH``.
  mathElements: MathElement[];
}

export interface InputParameterInfo {
  parameter: ParameterInfo;
  inputName: string;
  parameterInstance: number;
  mandatory: boolean;
  argument: ArgumentInfo;
}

export interface OutputParameterInfo {
  parameter: ParameterInfo;
  outputName: string;
}

export interface MathElement {
  // Type of element, either an operand kind or an operator.
  type: Type;

  // Operator symbol if type ``OPERATOR``.
  operator: string;

  // Constant if type ``VALUE_OPERAND``.
  value: number;

  // Parameter whose value is used if type ``PARAMETER``.
  parameter: ParameterInfo;

  // Parameter instance specifier
  parameterInstance: number;
}

export interface ContainerInfo {
  name: string;
  qualifiedName: string;
  shortDescription: string;
  longDescription: string;
  alias: NamedObjectId[];
  maxInterval: string; // String decimal
  sizeInBits: number;
  baseContainer: ContainerInfo;
  restrictionCriteria: ComparisonInfo[];
  restrictionCriteriaExpression: string;
  entry: SequenceEntryInfo[];
  usedBy: UsedByInfo;
  // ancillaryData: { [key: string]: AncillaryDataInfo };
  archivePartition: boolean;
}

export interface SequenceEntryInfo {
  locationInBits: number;
  referenceLocation: ReferenceLocationType;

  // For use in sequence containers
  container: ContainerInfo;
  parameter: ParameterInfo;

  // For use in command containers
  argument: ArgumentInfo;
  fixedValue: FixedValueInfo;
  repeat: RepeatInfo;
  indirectParameterRef: IndirectParameterRefInfo;
}

export interface FixedValueInfo {
  name: string;
  hexValue: string;
  sizeInBits: number;
}

export interface RepeatInfo {
  fixedCount: string; // String decimal
  dynamicCount: ParameterInfo;
  bitsBetween: number;
}

export interface IndirectParameterRefInfo {
  parameter: ParameterInfo;
  aliasNamespace: string;
}

export interface ArgumentMemberInfo {
  name: string;
  shortDescription: string;
  longDescription: string;
  alias: NamedObjectId[];
  type: ArgumentTypeInfo;
  initialValue: string;
}

export interface ArgumentDimensionInfo {
  // Use a fixed integer value. If set, no other options are applicable.
  // This value describes the length.
  fixedValue: string; // String decimal

  // Use the value of the referenced parameter.
  // The value describes the zero-based ending index (length - 1)
  //
  // For a value ``v``, the dimension's length is determined
  // as: ``(v * slope) + intercept``.
  parameter: ParameterInfo;

  // Use the value of the referenced argument.
  // The value describes the zero-based ending index (length - 1)
  //
  // For a value ``v``, the dimension's length is determined
  // as: ``(v * slope) + intercept``.
  argument: string;

  // Scale the value obtained from a parameter or argument reference.
  slope: string; // String decimal

  // Shift the value obtained from a parameter or argument reference.
  intercept: string; // String decimal
}

export interface ArgumentAssignmentInfo {
  name: string;
  value: string;
}

export interface SignificanceInfo {
  consequenceLevel: SignificanceLevelType;
  reasonForWarning: string;
}

export interface TransmissionConstraintInfo {
  expression: string;
  timeout: string; // String decimal
}

export interface CommandContainerInfo {
  name: string;
  qualifiedName: string;
  shortDescription: string;
  longDescription: string;
  alias: NamedObjectId[];
  sizeInBits: number;
  baseContainer: CommandContainerInfo;
  entry: SequenceEntryInfo[];
}

export interface VerifierInfo {
  stage: string;

  // Container update that is checked
  container: ContainerInfo;
  algorithm: AlgorithmInfo;

  // What action to take when a check succeeds
  onSuccess: TerminationActionType;

  // What action to take when a check fails
  onFail: TerminationActionType;

  // What action to take when a check times out
  onTimeout: TerminationActionType;

  // Time window during which a check is executed
  checkWindow: CheckWindowInfo;

  // Expression used to check this verifier
  expression: string;
}

export interface CheckWindowInfo {
  // Delay in milliseconds before starting to check
  timeToStartChecking: string; // String decimal

  // Duration in milliseconds of the check window
  timeToStopChecking: string; // String decimal

  // Reference time for starting the check window
  relativeTo: string;
}

enum Type {
  BINARY = "BINARY",
  BOOLEAN = "BOOLEAN",
  FLOAT = "FLOAT",
  INTEGER = "INTEGER",
  STRING = "STRING",
}

enum Type {
  POLYNOMIAL = "POLYNOMIAL",
  SPLINE = "SPLINE",
  MATH_OPERATION = "MATH_OPERATION",
  JAVA_EXPRESSION = "JAVA_EXPRESSION",
}

enum AlarmLevelType {
  NORMAL = "NORMAL",
  WATCH = "WATCH",
  WARNING = "WARNING",
  DISTRESS = "DISTRESS",
  CRITICAL = "CRITICAL",
  SEVERE = "SEVERE",
}

enum DataSourceType {
  TELEMETERED = "TELEMETERED",
  DERIVED = "DERIVED",
  CONSTANT = "CONSTANT",
  LOCAL = "LOCAL",
  SYSTEM = "SYSTEM",
  COMMAND = "COMMAND",
  COMMAND_HISTORY = "COMMAND_HISTORY",
  EXTERNAL1 = "EXTERNAL1",
  EXTERNAL2 = "EXTERNAL2",
  EXTERNAL3 = "EXTERNAL3",
  GROUND = "GROUND",
}

enum Scope {
  GLOBAL = "GLOBAL",
  COMMAND_VERIFICATION = "COMMAND_VERIFICATION",
  CONTAINER_PROCESSING = "CONTAINER_PROCESSING",
}

enum Type {
  CUSTOM = "CUSTOM",
  MATH = "MATH",
}

enum Type {
  VALUE_OPERAND = "VALUE_OPERAND",
  THIS_PARAMETER_OPERAND = "THIS_PARAMETER_OPERAND",
  OPERATOR = "OPERATOR",
  PARAMETER = "PARAMETER",
}

enum ReferenceLocationType {
  CONTAINER_START = "CONTAINER_START",
  PREVIOUS_ENTRY = "PREVIOUS_ENTRY",
}

enum OperatorType {
  EQUAL_TO = "EQUAL_TO",
  NOT_EQUAL_TO = "NOT_EQUAL_TO",
  GREATER_THAN = "GREATER_THAN",
  GREATER_THAN_OR_EQUAL_TO = "GREATER_THAN_OR_EQUAL_TO",
  SMALLER_THAN = "SMALLER_THAN",
  SMALLER_THAN_OR_EQUAL_TO = "SMALLER_THAN_OR_EQUAL_TO",
}

enum SignificanceLevelType {
  NONE = "NONE",
  WATCH = "WATCH",
  WARNING = "WARNING",
  DISTRESS = "DISTRESS",
  CRITICAL = "CRITICAL",
  SEVERE = "SEVERE",
}

enum TerminationActionType {
  SUCCESS = "SUCCESS",
  FAIL = "FAIL",
}
