const OWNER = "yajuusennpaiyarimasunele-cmyk
";
const REPO = "sns";
const FILE_PATH = "posts.json";
const TOKEN = "YOUR_GITHUB_TOKEN";  // ★ GitHub Token を入れる

async function loadPosts() {
    const res = await fetch(`https://raw.githubusercontent.com/${OWNER}/${REPO}/main/${FILE_PATH}`);
    const posts = await res.json();

    const tl = document.getElementById('timeline');
    tl.innerHTML = posts.reverse().map(p => `<p>${p.text}</p>`).join('');
}

async function post() {
    const text = document.getElementById("text").value;
    if (!text) return;

    // 現在の posts.json を取得
    const file = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`);
    const json = await file.json();

    const content = JSON.parse(atob(json.content));
    content.push({ text, time: Date.now()});

    // 更新
    await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`, {
        method: "PUT",
        headers: {
            "Authorization": `token ${TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: "new post",
            content: btoa(JSON.stringify(content, null, 2)),
            sha: json.sha
        })
    });

    loadPosts();
}

loadPosts();
