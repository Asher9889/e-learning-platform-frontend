interface Props {
  children: React.ReactNode;
}

export function SectionGrid({
  children,
}: Props) {
  return (

    <div className="grid gap-6 lg:grid-cols-2">

      {children}

    </div>

  );
}