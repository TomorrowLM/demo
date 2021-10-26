import React, {useState,useEffect} from 'react'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'

interface EditorProps {
  defaultValue?: string,
  disabled?:boolean,
  key?:string,
  height?:number,
  onChange?: (e: any) => void
}

const Editor: React.FC<EditorProps> = (props) => {
  const { defaultValue='',disabled=false,height=160, key } = props;
  const [editorState, setEditorState] = useState(BraftEditor.createEditorState(defaultValue));
  const handleEditorChange = (es: any) => {
      setEditorState(es)
      if (props.onChange) {
        if (es.toText()=='') {
         props.onChange('')
        } else {
          props.onChange(es.toHTML())
        }
      }
    };
    
    useEffect(() => {
      if (props.onChange) {
        props.onChange(props.defaultValue)
      }
    }, []);

    return (
          <BraftEditor
              key={key}
              controls={[
                          'undo', 'redo', 'split', 'font-size', 'font-family',
                          'indent','text-color', 'bold', 'italic',
                          'text-align', 'split', 'headings', 'list_ul',
                          'clear'
                        ]}
              defaultValue={editorState}
              onChange={handleEditorChange}
              disabled={disabled}
              contentStyle={{ height }}
              style={{border:"1px solid #d9d9d9", pointerEvents:"auto", opacity: 1, filter: "none"}}
          ></BraftEditor>
    );
};

export default Editor;
