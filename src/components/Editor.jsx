import { forwardRef } from 'react';
import ReactAce from 'react-ace';
const AceEditor = ReactAce.default || ReactAce;
import 'ace-builds/src-noconflict/mode-latex';
import 'ace-builds/src-noconflict/theme-chrome';
import 'ace-builds/src-noconflict/theme-monokai';

const Editor = forwardRef(function Editor({ isDark }, ref) {
    return (
        <div className="card-text border rounded p-3">
            <AceEditor
                ref={ref}
                mode="latex"
                theme={isDark ? 'monokai' : 'chrome'}
                name="user_input_area"
                width="100%"
                minLines={3}
                maxLines={Infinity}
                fontSize="12pt"
                wrapEnabled={true}
                showGutter={true}
                showPrintMargin={false}
                editorProps={{ $blockScrolling: Infinity }}
                commands={[
                    { name: 'gotoline', bindKey: null, exec: () => {} },
                    { name: 'find', bindKey: null, exec: () => {} },
                ]}
            />
        </div>
    );
});

export default Editor;
