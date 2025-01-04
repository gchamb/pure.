type EditorViewProps = {
  fileContents: string;
};

export default function EditorViewer(props: EditorViewProps) {
  return (
    <div className="">
      <pre className="text-left">
        <code>{props.fileContents}</code>
      </pre>
    </div>
  );
}
