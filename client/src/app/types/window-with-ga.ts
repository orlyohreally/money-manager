export type WindowWithGA = Window & {
  gtag: (
    config: string,
    ga_measurement_id: string,
    setup: { page_path?: string }
  ) => void;
}
