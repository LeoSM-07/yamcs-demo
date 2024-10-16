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
