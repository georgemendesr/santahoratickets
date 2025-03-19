
interface EventLoadingStateProps {
  message?: string;
}

export const EventLoadingState = ({ message = "Carregando..." }: EventLoadingStateProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-8">
        <p>{message}</p>
      </div>
    </div>
  );
};
