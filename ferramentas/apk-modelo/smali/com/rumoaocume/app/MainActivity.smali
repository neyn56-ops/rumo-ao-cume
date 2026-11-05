.class public Lcom/rumoaocume/app/MainActivity;
.super Landroid/app/Activity;

.field private wv:Landroid/webkit/WebView;

.method public constructor <init>()V
    .registers 1
    invoke-direct {p0}, Landroid/app/Activity;-><init>()V
    return-void
.end method

.method private imersivo()V
    .registers 4
    invoke-virtual {p0}, Lcom/rumoaocume/app/MainActivity;->getWindow()Landroid/view/Window;
    move-result-object v0
    invoke-virtual {v0}, Landroid/view/Window;->getDecorView()Landroid/view/View;
    move-result-object v1
    const/16 v2, 0x1706
    invoke-virtual {v1, v2}, Landroid/view/View;->setSystemUiVisibility(I)V
    sget v1, Landroid/os/Build$VERSION;->SDK_INT:I
    const/16 v2, 0x1c
    if-lt v1, v2, :fim
    invoke-virtual {v0}, Landroid/view/Window;->getAttributes()Landroid/view/WindowManager$LayoutParams;
    move-result-object v1
    const/4 v2, 0x1
    iput v2, v1, Landroid/view/WindowManager$LayoutParams;->layoutInDisplayCutoutMode:I
    invoke-virtual {v0, v1}, Landroid/view/Window;->setAttributes(Landroid/view/WindowManager$LayoutParams;)V
    :fim
    return-void
.end method

.method protected onCreate(Landroid/os/Bundle;)V
    .registers 6
    invoke-super {p0, p1}, Landroid/app/Activity;->onCreate(Landroid/os/Bundle;)V
    invoke-virtual {p0}, Lcom/rumoaocume/app/MainActivity;->getWindow()Landroid/view/Window;
    move-result-object v0
    const/16 v1, 0x400
    invoke-virtual {v0, v1, v1}, Landroid/view/Window;->setFlags(II)V
    const/16 v1, 0x80
    invoke-virtual {v0, v1}, Landroid/view/Window;->addFlags(I)V
    new-instance v0, Landroid/webkit/WebView;
    invoke-direct {v0, p0}, Landroid/webkit/WebView;-><init>(Landroid/content/Context;)V
    iput-object v0, p0, Lcom/rumoaocume/app/MainActivity;->wv:Landroid/webkit/WebView;
    invoke-virtual {v0}, Landroid/webkit/WebView;->getSettings()Landroid/webkit/WebSettings;
    move-result-object v1
    const/4 v2, 0x1
    invoke-virtual {v1, v2}, Landroid/webkit/WebSettings;->setJavaScriptEnabled(Z)V
    invoke-virtual {v1, v2}, Landroid/webkit/WebSettings;->setDomStorageEnabled(Z)V
    invoke-virtual {v1, v2}, Landroid/webkit/WebSettings;->setAllowFileAccess(Z)V
    const/4 v3, 0x0
    invoke-virtual {v1, v3}, Landroid/webkit/WebSettings;->setMediaPlaybackRequiresUserGesture(Z)V
    invoke-virtual {p0, v0}, Lcom/rumoaocume/app/MainActivity;->setContentView(Landroid/view/View;)V
    invoke-direct {p0}, Lcom/rumoaocume/app/MainActivity;->imersivo()V
    new-instance v1, Lcom/rumoaocume/app/Cliente;
    invoke-direct {v1}, Lcom/rumoaocume/app/Cliente;-><init>()V
    invoke-virtual {v0, v1}, Landroid/webkit/WebView;->setWebViewClient(Landroid/webkit/WebViewClient;)V
    invoke-virtual {v0}, Landroid/view/View;->requestFocus()Z
    const-string v1, "https://neyn56-ops.github.io/rumo-ao-cume/?apk=1"
    invoke-virtual {v0, v1}, Landroid/webkit/WebView;->loadUrl(Ljava/lang/String;)V
    return-void
.end method

.method protected onResume()V
    .registers 2
    invoke-super {p0}, Landroid/app/Activity;->onResume()V
    iget-object v0, p0, Lcom/rumoaocume/app/MainActivity;->wv:Landroid/webkit/WebView;
    if-eqz v0, :fim
    invoke-virtual {v0}, Landroid/webkit/WebView;->onResume()V
    invoke-direct {p0}, Lcom/rumoaocume/app/MainActivity;->imersivo()V
    :fim
    return-void
.end method

.method protected onPause()V
    .registers 2
    iget-object v0, p0, Lcom/rumoaocume/app/MainActivity;->wv:Landroid/webkit/WebView;
    if-eqz v0, :fim
    invoke-virtual {v0}, Landroid/webkit/WebView;->onPause()V
    :fim
    invoke-super {p0}, Landroid/app/Activity;->onPause()V
    return-void
.end method

.method public onWindowFocusChanged(Z)V
    .registers 2
    invoke-super {p0, p1}, Landroid/app/Activity;->onWindowFocusChanged(Z)V
    if-eqz p1, :fim
    invoke-direct {p0}, Lcom/rumoaocume/app/MainActivity;->imersivo()V
    :fim
    return-void
.end method

.method public onBackPressed()V
    .registers 4
    iget-object v0, p0, Lcom/rumoaocume/app/MainActivity;->wv:Landroid/webkit/WebView;
    if-eqz v0, :fim
    const-string v1, "window.dispatchEvent(new KeyboardEvent('keydown',{code:'Escape',key:'Escape',bubbles:true}));window.dispatchEvent(new KeyboardEvent('keyup',{code:'Escape',key:'Escape',bubbles:true}));"
    const/4 v2, 0x0
    invoke-virtual {v0, v1, v2}, Landroid/webkit/WebView;->evaluateJavascript(Ljava/lang/String;Landroid/webkit/ValueCallback;)V
    :fim
    return-void
.end method
