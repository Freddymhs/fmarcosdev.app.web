const MessageArea = ({ message }: { message: string }) => {
  return (
    <div className="p-4 bg-highlight-yellow border border-[var(--color-background-main)]/30 rounded-sm text-primary-color">
      {message}
    </div>
  );
};
export default MessageArea;
