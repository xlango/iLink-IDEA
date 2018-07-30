1.项目管理和综合工具:maven<br>
(1)Maven安装和配置:参考https://www.yiibai.com/maven/maven_environment_setup.html<br>
(2)Eclipse和IDEA配置Maven<br>

2.Spring版本：5.0.7<br>
3.MVC：Spring MVC配置<br>
(1)jar包:spring-webmvc.jar<br>
(2)web.xml配置SpringMVC监听类：org.springframework.web.context.ContextLoaderListener<br>
(3)SpringMVC核心配置文件：spring-mvc.xml  配置自动扫描的包、配置视图解析器 如何把 handler方法返回值解析为实际的物理视图、配置静态资源映射静态资源交给默认的Servlet、配置 mvc:annotation-driven标签开启注解<br>
(4)@RestController =@Controller+@ResponseBody<br>
(5)@RequestMapping("/")<br>
(6)页面跳转使用 ModelAndView<br>

4.实现文件上传下载：参考：https://blog.csdn.net/jronzhang/article/details/61210700<br>
(1)相关jar包：commons-fileupload、commons-io、commons-codec<br>
(2)Spring核心文件配置：bean  multipartResolver   maxUploadSize设置最大上传文件大小       defaultEncoding设置编码<br>
(3)下载测试url：http://localhost:8080/iLink/file/down<br>

5.IDEA开发出现java.lang.ClassNotFoundException:org.springframework.web.context.ContextLoaderListener错误解决方法<br>
解決方法：在IDEA中点击File > Project Structure > Artifacts > 在右侧Output Layout右击项目名，选择Put into Output Root。
执行后，在WEB-INF在增加了lib目录，里面是项目引用的jar包。<br>
参考：https://blog.csdn.net/du_23tiyanwang/article/details/80654313  <br>

6.实现文件上传功能，在浏览器中上传文件报错：HTML+Jquery+ajax post提交SpringMVC服务端 <br>
报错信息：java.io.EOFException: Unexpected EOF read on the socket  <br>
解决方法：使用ajax异步传输的问题，换了用jsp页面直接form表单post方式提交解决了问题 <br>
html使用jquery-form.js异步提交解决了问题。<br>
参考：https://www.jb51.net/article/112440.htm   <br>

7.git工具<br>
(1)annotate:如何项目中有一行代码不知道是什么意思，在当前代码行右击，然后点击annotate查看当前行的作者<br>
(2)移动所有改动之处    Previous Change 快捷键<br>
(3)撤销，包括单个和项目改动之处    Revert快捷键<br>
(4)提交代码遇到问题：Push rejected: Push to origin/master was rejected  <br>

8.实现多文件同时上传，Controller接受参数使用MultipartFile[]数组，循环遍历上传 <br>

9.jquery实现上传文件进度监听及进度条的实现<br>
(1)原理:给XMLHttpRequest对象的upload属性绑定onprogress方法监听上传过程<br>
(2)因为jQuery默认使用的XMLHttpRequest对象是内部生成的无法直接给jq的xhr绑定onprogress方法
   所以只要给jQuery重新生成一个绑定了onprogress的XMLHttpRequest对象即可实现<br>
(3)首先封装一个方法 传入一个监听函数 返回一个绑定了监听函数的XMLHttpRequest对象<br>
(4)ajax请求时加：<br> xhr:xhrOnProgress(function(e){<br>
                    var percent=e.loaded / e.total;//计算百分比   <br>
                })<br>
(5)参考：https://blog.csdn.net/qq_21119773/article/details/52796375   <br>




