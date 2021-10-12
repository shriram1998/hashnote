function Thumbnail(value, type) {
    let thumbnailText;
    switch (type) {
        case 'code':
            thumbnailText = value.split('\n').slice(0, 18);
            break;
        case 'text':
            thumbnailText = value.replace('\n', ' ').slice(0, 500);
            break;
    }
    return thumbnailText;
}
onmessage = (e) => {
    const { value,type } = e.data;
    const thumbnailText = Thumbnail(value, type);
    postMessage({
        thumbnailText
    });
}