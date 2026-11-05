.class public Lcom/rumoaocume/app/Cliente;
.super Landroid/webkit/WebViewClient;
# abre o jogo do site (atualiza sozinho e fica guardado para jogar sem internet);
# se não abrir de jeito nenhum (sem internet na 1ª vez), usa a cópia que vem dentro do app

.field private usouCopia:Z

.method public constructor <init>()V
    .registers 1
    invoke-direct {p0}, Landroid/webkit/WebViewClient;-><init>()V
    return-void
.end method

.method private copia(Landroid/webkit/WebView;)V
    .registers 4
    iget-boolean v0, p0, Lcom/rumoaocume/app/Cliente;->usouCopia:Z
    if-nez v0, :fim
    const/4 v0, 0x1
    iput-boolean v0, p0, Lcom/rumoaocume/app/Cliente;->usouCopia:Z
    const-string v1, "file:///android_asset/index.html?apk=1"
    invoke-virtual {p1, v1}, Landroid/webkit/WebView;->loadUrl(Ljava/lang/String;)V
    :fim
    return-void
.end method

.method public onReceivedError(Landroid/webkit/WebView;ILjava/lang/String;Ljava/lang/String;)V
    .registers 5
    invoke-direct {p0, p1}, Lcom/rumoaocume/app/Cliente;->copia(Landroid/webkit/WebView;)V
    return-void
.end method

.method public onReceivedError(Landroid/webkit/WebView;Landroid/webkit/WebResourceRequest;Landroid/webkit/WebResourceError;)V
    .registers 5
    invoke-interface {p2}, Landroid/webkit/WebResourceRequest;->isForMainFrame()Z
    move-result v0
    if-eqz v0, :fim
    invoke-direct {p0, p1}, Lcom/rumoaocume/app/Cliente;->copia(Landroid/webkit/WebView;)V
    :fim
    return-void
.end method
