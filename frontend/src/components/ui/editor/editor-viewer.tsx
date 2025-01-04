type EditorViewProps = {
  fileContents: string;
};

export default function EditorViewer(props: EditorViewProps) {
  return (
    <div>
      <code>{props.fileContents}</code>
    </div>
  );
}
