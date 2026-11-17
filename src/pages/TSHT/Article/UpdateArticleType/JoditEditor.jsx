import * as React from "react";
import { useMemo } from "react";
import JoditEditor from "jodit-react";
export default function JoditEditorGlobal(props) {
  const { content, setContent, editorRef, placeholder } = props;
  const config = useMemo(
    () => ({
      readonly: false,
      autofocus: true,
      tabIndex: 1,
      languages: "vi",
      height: 500,
      extraPlugins: ["stat"],
      // askBeforePasteHTML: false,
      // askBeforePasteFromWord: false,
      // defaultActionOnPaste: "insert_clear_html",
      cleanHTML: {
        fillEmptyParagraph: true,
        removeEmptyElements: true,
        replaceNBSP: true,
      },
      // allowTags: "p,strong,em,ul,ol,li,br,span,a,img",
      placeholder: placeholder,
      beautyHTML: false,
      toolbarButtonSize: "large",
      controls: {
        lineHeight: {
          list: {
            1: "1",
            1.1: "1.1",
            1.2: "1.2",
            1.3: "1.3",
            1.4: "1.4",
            1.5: "1.5",
            1.6: "1.6",
            1.7: "1.7",
            1.8: "1.8",
            1.9: "1.9",
            2: "2",
          },
        },
      },
      events: {
        afterInit: () => {
          const contentClean = content.replace("<p><br></p>", "");
          setContent(contentClean);
        },
      },
      style: {
        fontSize: "18px",
        lineHeight: "1.6",
        fontFamily: "Mulish, Helvetica, Arial, sans-serif",
      },
    }),
    [placeholder]
  );
  const sanitizeContent = (html) => {
    console.log("html", html);
    return html
      .replace(/\uFEFF/g, "") // Xóa BOM
      .replace("<p><br></p>", "") // Xóa BOM
      .replace(/<span[^>]*data-jodit-temp[^>]*>(.*?)<\/span>/gi, "$1") // Xóa span marker
      .replace(/<span[^>]*jodit-selection_marker[^>]*><\/span>/gi, ""); // Xóa span marker rỗng
  };
  console.log("content", content);
  return (
    <JoditEditor
      ref={editorRef}
      value={`${content}`}
      config={config}
      onBlur={(newContent) => setContent(sanitizeContent(newContent))}
    />
  );
}
