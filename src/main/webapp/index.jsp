<%--
  Created by IntelliJ IDEA.
  User: xyl
  Date: 2018/7/27
  Time: 10:12
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
</head>
<body>
<form action="/iLink/file/upload" enctype="multipart/form-data" method="post">
    <table>
        <tr>
            <td>描述：</td>
            <td><input type="text" name="description"></td>
        </tr>
        <tr>
            <td>请选择文件：</td>
            <td><input type="file" name="file"></td>
        </tr>
        <tr>
            <td>开始上传</td>
            <td><input type="submit" value="上传"></td>
        </tr>
    </table>
</form>
</body>
</html>
