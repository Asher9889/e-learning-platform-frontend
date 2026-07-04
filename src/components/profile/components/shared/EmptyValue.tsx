interface Props {
  value?: string | null;
}

export function EmptyValue({ value }: Props) {
  if (!value) {
    return (
      <span className="text-muted-foreground">
        —
      </span>
    );
  }

  return <>{value}</>;
}