export const SectionDivider = () => {
  return (
    <div className="relative py-16 sm:py-20 overflow-hidden">
      <div className="mx-auto h-px w-2/3 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-10 w-2/3 bg-primary/10 blur-2xl"
        style={{ marginLeft: "-33.333%", marginTop: "-20px" }}
        aria-hidden="true"
      />
    </div>
  );
};
