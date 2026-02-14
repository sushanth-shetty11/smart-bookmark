interface ContainerProps {
  children: React.ReactNode;
}

export default function Container({ children }: ContainerProps) {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {children}
    </main>
  );
}
