import { ReactElement, useState } from "react";

import { exit } from "@tauri-apps/api/process";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { initialContent } from "../helpers/shortcuts";
import { onLoadFile, onSaveFile, closeApplication } from "../helpers/filesys";

import StatusBar from "./StatusBar";
import MenuBar from "./MenuBar";

export default function MainEditor(): ReactElement {
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");

  let editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    onUpdate({ editor }) {
      setIsChanged(true);
    },
  });

  // Set the focus to the editor
  // editor?.view.focus();
  editor?.commands.focus();

  const handleEvent = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      onKeyUp={async (e: React.KeyboardEvent<HTMLDivElement>) => {
        handleEvent(e);

        if (e.ctrlKey && e.key === "s") {
          onSaveFile(editor);
          setIsChanged(false);
        }

        if (e.ctrlKey && e.key === "o") {
          const fileName = await onLoadFile(editor);

          setFileName(fileName);
        }

        if (e.ctrlKey && e.key === "q") {
          console.log({ isChanged });

          const confirmed = await closeApplication(isChanged);
          if (!isChanged && confirmed) exit();
        }
      }}
    >
      {editor && <MenuBar editor={editor} />}
      <EditorContent editor={editor} />
      {!!fileName && <StatusBar fileName={fileName} isChanged={isChanged} />}
    </div>
  );
}

/*
 * https://tiptap.dev/api/commands/set-content
 * https://github.com/tauri-apps/tauri/blob/527bd9f/tooling/api/src/dialog.ts#L57
 * https://tauri.app/v1/api/js/path
 * https://tauri.app/v1/api/js/process
 * https://tiptap.dev/api/commands/focus
 * https://github.com/ueberdosis/tiptap/issues/389#issuecomment-512991733
 * https://tauri.app/v1/api/js/dialog/#confirm
 */
