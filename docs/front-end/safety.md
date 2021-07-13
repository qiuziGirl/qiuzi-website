# 安全

## XSS

> **跨站脚本攻击**（Cross-Site Scripting，XSS）是指通过存在安全漏洞的 Web 网站注册用户的浏览器运行非法的 HTML 标签或 JavaScript 进行的一种攻击。
动态创建的 HTML 部分有可能隐藏着安全漏洞。就这样，攻击者编写脚本设下陷阱，用户在自己的浏览器上运行时，一不小心就会受到被动攻击。

XSS 分为三种：反射型，存储型和 DOM-based

### 如何攻击

XSS 通过修改 HTML 节点或者执行 JS 代码来攻击网站，例如通过 URL 获取某些参数

```js
<!-- http://www.domain.com?name=<script>alert(1)</script> -->
<div>{{ name }}</div>
```

上述 URL 输入可能会将 HTML 改为 `<div><script>alert(1)</script></div>`，这样页面中就凭空多了一段可执行脚本。这种攻击类型是反射型攻击，也可以说是 DOM-based 攻击。

也有另一种场景，例如写了一篇包含攻击代码 `<script>alert(1)</script>` 的文章，那么浏览文章的用户都会被攻击到。这种攻击类型为存储型攻击，也可以说是 DOM-based 攻击，并且这种攻击打击面更广。

### 如何防御

最普遍做法是转义字符，如对引号、尖括号、斜杆等进行转义

```js
function escape(str) {
  str = str.replace(/&/g, '&amp;')
  str = str.replace(/</g, '&lt;')
  str = str.replace(/>/g, '&gt;')
  str = str.replace(/"/g, '&quto;')
  str = str.replace(/'/g, '&#39;')
  str = str.replace(/`/g, '&#96;')
  str = str.replace(/\//g, '&#x2F;')

  return str
}
```

通过转义可以将攻击代码 `<script>alert(1)</script>` 变成

```js
// -> &lt;script&gt;alert(1)&lt;&#x2F;script&gt;
escape('<script>alert(1)</script>')
```

对于富文本显示，不能通过上面的方法来转义所有字符，这样会把需要的格式也过滤掉。通常，会采用白名单过滤方案。
当然，也可以通过黑名单过滤，但考虑到需要过滤的标签与标签属性过多，更加推荐使用白名单方案。

```js
const xss = require('xss')
const html = xss('<h1 id="title">XSS Demo</h1><script>alert("xss");</script>')

// -> <h1>XSS Demo</h1>&lt;script&gt;alert("xss");&lt;/script&gt;
console.log(html)
```

以上示例使用 [xss](https://www.npmjs.com/package/xss) 来实现，可以看到输出中保留了 `h1` 标签且过滤掉了 `script` 标签

### CSP

> **内容安全策略**（Content-Security-Policy，CSP）实质就是白名单制度，开发者明确告诉客户端，哪些外部资源可以加载与执行。
CSP 大大增强了网页的安全性。攻击者即使发现了漏洞，也没法注入脚本，除非还控制了一台列入白名单的可信主机。

有两种方法可以启动 CSP，一种通过 HTTP Header 中的 `Content-Security-Policy` 字段

- 只允许加载本站资源

```js
Content-Security-Policy: default-src 'self'
```

- 只允许加载 HTTPS 协议图片

```js
Content-Security-Policy: img-srs https:
```

另一种通过设置网页的 `<meta>` 标签：

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-srs https:" />
```

更多属性查看 [这里](https://content-security-policy.com/)

## CSRF

> **跨站请求伪造** (Cross-Site Request Forgery，CSRF)，是一种挟制用户在当前已登录的 Web 应用程序上执行非本意的操作的攻击方法。
与 XSS 利用的是用户对指定网站的信任，CSRF 利用的是网站对用户网页浏览器的信任。

### 如何攻击

假设网站中有一个通过 Get 请求提交用户评论的接口，攻击者就可以在钓鱼网站中加入一个图片，图片的地址就是评论接口

```html
<img src="http://www.domain.com/xxx?comment='attack'" />
```

如果接口是 Post 提交的，就相对麻烦，需要用表单来提交接口

```html
<form action="http://www.domain.com/xxx" id="CSRF" method="post">
  <input name="comment" value="attack" type="hidden" />
</form>
```

### 如何防御

- Get 请求不对数据进行修改
- 不让第三方网站访问用户 Cookie
- 阻止第三方网站请求接口
- 请求时附带验证信息，如验证码或 Token

#### SameSite

对 Cookie 设置 `SameSite` 属性限制第三方 Cookie，但存在[兼容性问题](https://caniuse.com/?search=SameSite)

```js
Set-Cookie: CookieName=CookieValue; SameSite=Strict;
```

#### 验证 Referer

对需要防范 CSRF 的请求，通过验证 Referer 判断请求是否为第三方网站发起

#### Token

服务端下发随机 Token，客户端每次发起请求时携带上 Token，服务端验证 Token 是否有效

## 密码安全

密码安全虽然大多为后端的事情，但当下前端逐渐后端化，密码安全也是我们应了解的知识。

### 加盐

对于密码存储来说，必然是不能明文存储在数据库中。否则一旦数据库泄露，会造成极大损失。
同时因存在[彩虹表](https://zh.wikipedia.org/wiki/%E5%BD%A9%E8%99%B9%E8%A1%A8)，不建议只对密码单纯通过加密算法加密。

通常需要对密码加盐，然后进行几次不同加密算法的加密

```js
// 加盐就是给原密码添加字符串，增加原密码长度
sha256(sha1(md5(salt + password + salt)))
```

但是加盐并不能阻止别人盗取账号，而是确保即使数据库泄露，不会暴露用户的真实密码。一旦攻击者得到用户账号，可通过暴力破解的方式破解密码。
对于这种情况，通常使用验证码增加延时或限制尝试次数来防护。并且一旦用户输入了错误密码，也不能直接提示用户输错密码，而应该提示账号或密码错误。