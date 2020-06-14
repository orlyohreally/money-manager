export type WindowWithGA = Window & {
  gtag: (
    config: string,
    ga_measurement_id: string,
    setup: { [property: string]: string | number }
  ) => void;
};
