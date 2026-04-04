type ErrorMessageProps = {
  message: string;
};

function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <p style={{ color: "crimson", marginTop: "12px" }}>
      {message}
    </p>
  );
}

export default ErrorMessage;