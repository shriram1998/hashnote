function LCS(oldStr, newStr) {
    let a = oldStr.trim().split(" ");
    let b = newStr.trim().split(" ");
    let n = a.length;
    let m = b.length;
    let result=new Array(a.length+1).fill(0).map(() => new Array(b.length+1).fill(0));
    a.forEach((av, ix) => {
        b.forEach((bv, iy) => {
            if (av === bv) {
                result[ix + 1][iy + 1] = 1 + result[ix][iy]
            }
            else {
                result[ix + 1][iy + 1] = Math.max(result[ix][iy + 1], result[ix + 1][iy])
            }
        });
    });
    return (Math.max(n,m)-result[n][m]);
}
onmessage = (e) => {
    const { oldStr, newStr } = e.data;
    const changes = LCS(oldStr, newStr);
    postMessage({
        changes
    });
}