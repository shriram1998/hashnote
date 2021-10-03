import React, { useRef, useState, useEffect } from 'react'

export default function useCKEditor () {
  const editorRef = useRef()
  const [isEditorLoaded, setIsEditorLoaded] = useState(false)
  const { CKEditor, BalloonEditor } = editorRef.current || {}

  useEffect(() => {
    editorRef.current = {
      // CKEditor: require('@ckeditor/ckeditor5-react'), // depricated in v3
      CKEditor: require('@ckeditor/ckeditor5-react').CKEditor, // v3+
      BalloonEditor: require('@ckeditor/ckeditor5-build-classic')
    }
    setIsEditorLoaded(true)
  }, [])

  return Object.freeze({
    isEditorLoaded,
    CKEditor,
    BalloonEditor
  })
}