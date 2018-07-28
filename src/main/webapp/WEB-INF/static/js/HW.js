/**
 *
 * @developer Hacker丶Wand (578112964@qq.com)
 * @date    2015-11-11 17:22:16
 * @version $Id$
 */
(function(){
    if(!window.applicationCache){
        window.location.href="http://hw.hackerwand.com/nohtml5.html";
        return;
    }
    // --------------------组件开发区-------------------------
    // --------------------组件注册------------------------
    window.HW = {};
    HW.URLTool = {}; //URL组件
    HW.Reg = {}; //正则组件
    HW.Form = {}; //表单组件
    HW.Pop = {}; //弹出层组件
    HW.View = {}; //视窗组件
    HW.Document = {}; //文档DOM组件
    HW.Widget = {}; //控件组件
    HW.Effect = {}; //特效组件
    // --------------------全局常量------------------------
    HW.NULLF = function() {};
    // HW.HOST = 'http://hw.hackerwand.com/';
    // --------------------初始化事件------------------------

    // --------------------全局函数区--------------------
    // --------------------URL工具--------------------
    /**
     * URL跳转
     * _U:{}
     * _U.url 跳转的url地址
     * _U.target 是否在新窗口中打开
     */
    HW.URLTool.Redirect = function(_U) {
        if (typeof _U.url === 'undefined')
            return;
        if (typeof _U.target !== 'undefined') {
            window.open(_U.url);
        } else {
            window.location.href = _U.url;
        }
    }
    // -------------------正则工具---------------------------------
    HW.Reg.rules = {
        email: /^\w+([-=.]\w+)*@\w+([-.]\w)*\.\w+([-.]\w+)*$/,
        useraccount: /(^[\u4e00-\u9fa5\w]{3,20}$)|(^\w+([-=.]\w+)*@\w+([-.]\w)*\.\w+([-.]\w+)*$)|(^\d{11}$)/,
        pw: /^.{6,20}$/
    };
    /**
     * 正则验证
     * _R:{}
     * _R.data 要验证的数据
     * _R.rule 使用的正则表达式对象
     */
    HW.Reg.Check = function(_R) {
        if (typeof _R === 'undefined' || typeof _R.data === 'undefined' || typeof _R.rule === 'undefined')
            return false;
        if (typeof _R.rule.test !== 'function')
            return false;
        var result = _R.rule.test(_R.data);
        if (typeof _R.callBack === 'function')
            _R.callBack(result);
        return result;
    }
    // -------------------表单验证工具---------------------------------
    // 表单验证类型
    HW.Form.checkType = {
        account: 0,
        email: 1,
        pw: 2
    };
    /**
     * 表单验证事件
     * _F:{}
     * _F.type 验证的类型
     */
    HW.Form.RcheckInput = function(_F) {
        if (typeof _F === 'undefined' || typeof _F.type === 'undefined')
            return HW.NULLF;

        var check = {};

        check.rule = HW.Form.GetRule(_F.type);

        if (check.rule == null)
            return HW.NULLF;
        return function() {
            var input = $(this);
            var val = $.trim(input.val());
            check.data = val;
            if (!HW.Reg.Check(check)) {
                input.addClass('HW_input_error_msg');
            } else {
                input.removeClass('HW_input_error_msg');
            }
        }
    }
    /**
     * 获得表单数据
     * _G:{}
     * _G.input [] 表单的id数组
     * _G.each 遍历函数
     * _G.jchar 拼接字符串 默认为 &
     * each 函数必须返回要拼接进结果的值
     * each 的默认函数返回 name=val
     * 例如返回：name=val 返回类型为字符串
     */
    HW.Form.GetAllValString = function(_G) {
        if (typeof _G.input !== 'object')
            return "";
        var inputs = HW.Form.GetAllInputFromArray(_G.input);
        var result = [];
        if (typeof _G.each === 'undefined') {
            _G.each = function(el) {
                return el.attr('name') + '=' + $.trim(el.val());
            }
        }
        for (var i = 0; i < inputs.length; i++) {
            result.push(_G.each(inputs[i]));
        }
        if (typeof _G.jchar === 'undefined')
            _G.jchar = '&';
        return result.join(_G.jchar);
    }
    /**
     * 获得表单数据
     * _G:{}
     * _G.input [] 表单的id数组
     * _G.each 遍历函数
     * _G.type : true|false  为真时返回对象 假时返回对象数组 默认为true
     * each 函数必须返回要拼接进结果的值
     * each type为true时 的默认函数返回 {name:val,key:name} type为fasle时返回{name:val}
     * 例如返回：{name:val,key:name} 返回类型为字符串
     */
    HW.Form.GetAllValObj = function(_G) {
        if (typeof _G.input !== 'object')
            return [];
        if (typeof _G.type === 'undefined' || typeof _G.type !== 'boolean')
            _G.type = true;

        var inputs = HW.Form.GetAllInputFromArray(_G.input);
        var result = [];
        if (typeof _G.each === 'undefined') {
            _G.each = function(el) {
                var val = {};
                val[el.attr('name')] = $.trim(el.val());
                if (_G.type)
                    val.key = el.attr('name');
                return val;
            }
        }

        if (_G.type) {
            result = {};
            for (var i = 0; i < inputs.length; i++) {
                var item = _G.each(inputs[i]);
                result[item.key] = item[item.key];
            }
        } else {
            for (var i = 0; i < inputs.length; i++) {
                result.push(_G.each(inputs[i]));
            }
        }

        return result;
    }
    // 表单检查错误信息
    /**
     * 表单值检查
     * _G:{}
     * _G.input {} 表单的id数组
     *  input格式：
     *      [
     *          {
         *              name:'' 表单id
         *              rule:/^$/|HW.Form.checkType 正则表达式
         *              msg:'' 错误消息
         *          }
     *      ]
     * _G.each 遍历函数
     * each 必须返回Boolean值
     * each 默认函数为空时返回false
     */
    HW.Form.CheckInputVal = function(_G) {

        HW.Form.CheckInputVal.msg = "";

        if (typeof _G === 'undefined' || _G.input.length == 0)
            return false;
        if (typeof _G.each === 'undefined')
            _G.each = function(el) {
                if ($.trim(el.val()) == "") {
                    el.focus();
                    return false;
                } else
                    return true;
            }

        for (var i = 0; i < _G.input.length; i++) {
            var rule = _G.input[i].rule;
            if (typeof rule === 'number') {
                rule = HW.Form.GetRule(rule);
                _G.input[i].rule = rule;
            }
        }

        var inputs = HW.Form.GetAllInputFromObject(_G.input);

        for (var i = 0; i < inputs.length; i++) {
            if (!_G.each(inputs[i])) {
                HW.Form.CheckInputVal.msg = _G.input[i].msg;
                inputs[i].focus();
                return false;
            }
            if (_G.input[i].rule == null || !_G.input[i].rule.test($.trim(inputs[i].val()))) {
                HW.Form.CheckInputVal.msg = _G.input[i].msg;
                inputs[i].focus();
                return false;
            }
        }
        return true;
    }
    HW.Form.CheckInputVal.getMsg = function() {
        return HW.Form.CheckInputVal.msg || "";
    }
    /**
     * 获得input
     * _G:[]
     */
    HW.Form.GetAllInputFromArray = function(_G) {
        var inputs = [];
        for (var i = 0; i < _G.length; i++) {
            var temp = $(_G[i]);
            if (temp.length > 0)
                inputs.push(temp);
        }
        return inputs;
    }
    /**
     * 获得input
     * _G:[{}]
     */
    HW.Form.GetAllInputFromObject = function(_G) {
        var inputs = [];
        for (var i = 0; i < _G.length; i++) {
            var temp = $(_G[i].name);
            if (temp.length > 0)
                inputs.push(temp);
        }
        return inputs;
    }
    /**
     * 根据HW.Form.checkType 获得对应的正则对象
     * 返回HW.Reg.rules
     */
    HW.Form.GetRule = function(_G) {
        switch (_G) {
            case HW.Form.checkType.account:
                return HW.Reg.rules.useraccount;
                break;
            case HW.Form.checkType.email:
                return HW.Reg.rules.email;
                break;
            case HW.Form.checkType.pw:
                return HW.Reg.rules.pw;
                break;
            default:
                return null;
        }
    }
    /**
     * 多选框组件
     * _F:{}
     * _F.target:selector
     * _F.item:[] [{val:1,text:'',on:true,read:false,name:''}]
     */
    HW.Form.checkBox=function (_F){
        if(typeof _F !=='object')
            return;
        _F.target=(_F.target instanceof  jQuery)?_F.target:$(_F.target);
        _F.item=$.isArray(_F.item)?_F.item:[];
        _F.domItem=_F.target.children('span');
        _F.change=typeof _F.change==='function'?_F.change:HW.NULLF;

        this._F=_F;
        this.doms={};

        var doms=[];
        for(var l=0;l<_F.domItem.length;l++){
            var i=_F.domItem.eq(l);
            var tdom=$('<div class="HW_checkbox"></div>');
            if(typeof i.attr('on')!=='undefined')
                tdom.attr('on','true').addClass('HW_CK_checked');
            else
                tdom.attr('on','false').addClass('HW_CK_nochecked');

            if(typeof i.attr('read')!=='undefined')
                tdom.attr('read','true').addClass('HW_CK_read');
            else
                tdom.attr('read','false');

            tdom.attr('val',(typeof i.attr('val')==='undefined'?i.text():i.attr('val')));
            tdom.attr('name',(typeof i.attr('name')==='undefined'?i.text():i.attr('name')));
            tdom.text(i.text());
            doms.push(tdom);
        }

        for(var l=0;l<_F.item.length;l++){
            var i=_F.item[l];
            var tdom=$('<div class="HW_checkbox"></div>');
            tdom.attr({
                on: typeof i.on === 'undefined'?'false':'true',
                read: typeof i.read === 'undefined'?'false':'true',
                val: typeof i.val === 'undefined'?i.text:i.val,
                name: typeof i.name === 'undefined'?i.text:i.name
            }).text(i.text);
            if(i.on!=='undefined'&&i.on==true)
                tdom.addClass('HW_CK_checked');
            else
                tdom.addClass('HW_CK_nochecked');

            if(i.read!=='undefined'&&i.read==true)
                tdom.addClass('HW_CK_read');

            doms.push(tdom);
        }

        _F.target.html('');
        for(var i=0;i<doms.length;i++){
            this.doms[doms[i].attr('name')]=doms[i];
            _F.target.append(doms[i]);
        }

        function change(target){
            _F.change({
                val:$.trim(target.attr('val')),
                text:$.trim(target.text()),
                on:target.attr('on'),
                read:target.attr('read'),
                dom:target
            });
        }
        _F.target.click((function (x){
            return function(event) {
                var target=$(event.target||event.srcElement);
                if(!target.hasClass('HW_checkbox')||target.hasClass('HW_CK_read'))
                    return;
                if(target.attr('on')=='true'){
                    target.attr('on','false').removeClass('HW_CK_checked').addClass('HW_CK_nochecked');
                }else{
                    target.attr('on','true').removeClass('HW_CK_nochecked').addClass('HW_CK_checked');
                }
                change(target);
                x.doms[target.attr('name')]=target;
            }
        })(this));

        this.getValue=function (){
            var checkboxs=this._F.target.children('.HW_checkbox');
            var result=[];
            for(var i=0;i<checkboxs.length;i++){
                var ck=checkboxs.eq(i);
                if(ck.attr('on')==='true')
                    result.push(ck.attr('val'));
            }
            return result;
        }

        this.isOn=function (name){
            return this.doms[name].attr('on')==='true';
        }

        this.getAll=function(){
            return this.doms;
        }

        this.selectAll=function(){
            var checkboxs=this._F.target.children('.HW_checkbox');
            for(var i=0;i<checkboxs.length;i++){
                var target=checkboxs.eq(i);
                if(target.attr('read')==='true')
                    continue;
                target.attr('on','true').removeClass('HW_CK_nochecked').addClass('HW_CK_checked');
                this.doms[target.attr('name')]=target;
            }
        }

        this.cancelAll=function (){
            var checkboxs=this._F.target.children('.HW_checkbox');
            for(var i=0;i<checkboxs.length;i++){
                var target=checkboxs.eq(i);
                if(target.attr('read')==='true')
                    continue;
                target.attr('on','false').removeClass('HW_CK_checked').addClass('HW_CK_nochecked');
                this.doms[target.attr('name')]=target;
            }
        }
    }
    /**
     * 单选框组件
     * _F:{}
     * _F:target:selector
     * _F:name:string
     * _F.item:[] [{val:1,text:''}]
     */
    HW.Form.radio=function (_F){
        if(typeof _F !=='object')
            return;
        _F.target=(_F.target instanceof  jQuery)?_F.target:$(_F.target);
        _F.item=$.isArray(_F.item)?_F.item:[];
        _F.name=typeof _F.name==='undefined'?'radio':_F.name;

        var dom='';

        var tdom=_F.target.children('span');
        for(var i=0;i<tdom.length;i++){
            var t=tdom.eq(i);
            dom+='<div class="HW_radio_but" val="'
                +(typeof t.attr('val')==='undefined'?t.text():t.attr('val'))+'">'
                +t.text()+'</div>';
        }

        for(var i=0;i<_F.item.length;i++){
            var t=_F.item[i];
            dom+='<div class="HW_radio_but" val="'
                +(typeof t.val==='undefined'?t.text:t.val)+'">'
                +t.text+'</div>';
        }
        dom=$(dom);
        _F.target.html('').append(dom);
        var value=null;

        _F.target.click(function(event) {
            var target=$(event.target||event.srcElement);
            if(!target.hasClass('HW_radio_but'))
                return;
            target.addClass('radio_on').siblings('.HW_radio_but').removeClass('radio_on');
            value=target.attr('val');
        });

        this.getValue=function(){
            return value;
        }
    }
    // ------------------------视窗组件-----------------------------
    HW.View.window = $(window);
    HW.View.screenWidth = HW.View.window.width();
    HW.View.screenHeight = HW.View.window.height();
    /**
     * 当窗口改变时执行的事件数组
     * 按照绑定顺序进行执行
     * 使用push传入一个function(){}
     * 函数返回值必须为Boolean值
     * 当返回false时事件失效
     * 传入值不为function时自动移除该事件
     */
    HW.View.ResetSizeEventHandle = [];
    (function() {
        HW.View.ResetSizeEventHandle.push(function() {
            HW.View.screenWidth = HW.View.window.width();
            HW.View.screenHeight = HW.View.window.height();
            return true;
        });

        var handel = HW.View.ResetSizeEventHandle;

        function resetSizeDox() {
            for (var i = 0; i < handel.length; i++) {
                if (typeof handel[i] === 'function') {
                    if (handel[i]()===false) {
                        handel.splice(i, 1);
                    }
                } else
                    handel.splice(i, 1);
            }
        }
        //暂时使用绑定window.onresize 来处理双击最大化浏览器时 无法触发.resize事件的问题
        window.onresize = resetSizeDox;
        HW.View.window.resize(resetSizeDox);
    })();
    /**
     * 添加窗口大小改变时执行的事件
     */
    HW.View.AddResetSizeHandel = function(_V) {
        if (typeof _V === 'function')
            HW.View.ResetSizeEventHandle.push(_V);
    }
    /**
     * 使dom对象居中于浏览器
     * _V:{}
     * _V:auto 是否随着浏览器大小的改变改变 默认为true
     * _V:target selector
     */
    HW.View.fixedCenter=function(_V){
        _V.auto=typeof _V.auto!=='boolean'?true:_V.auto;
        var target=$(_V.target);
        if(target.length<1)
            return;
        target.css({
            position:'fixed',
            left:HW.View.screenWidth/2- target.width()/2,
            top:HW.View.screenHeight/2- target.height()/2
        });
        if(_V.auto)
            HW.View.AddResetSizeHandel((function(t){
                return function(){
                    var target=$(t);
                    if(target.length<1)
                        return false;
                    target.css({
                        position:'fixed',
                        left:HW.View.screenWidth/2- target.width()/2,
                        top:HW.View.screenHeight/2- target.height()/2
                    });
                }
            })(_V.target));
    }
    // ----------------------------文档DOM组件----------------------------
    HW.Document.document = $(document);
    HW.Document.body = $('body').eq(0);
    // ------------------------弹出层组件---------------------------
    HW.Pop.init = {
        dialogInit: function() {} //初始化
    };
    HW.Pop.message = {
        Create: function() {}, //创建消息框
        Close: function() {} //关闭消息框
    }; //消息框
    HW.Pop.dialog = {
        Create: function() {}, //创建对话框
        Close: function() {} //关闭对话框
    }; //对话框
    HW.Pop.mask = { //遮罩层
        mask: null, //遮罩div
        count: [], //当前需要使用遮罩的div
        Create: function() {}, //创建遮罩层
        Remove: function() {} //消除遮罩
    };
    HW.Pop.progress = {
        Create: function() {}
    }; //进度条
    HW.Pop.textDailog = {}; //创建文本输出框
    HW.Pop.Move = function() {}; //移动组件
    HW.Pop.Close = function() {};
    /**
     * 创造遮罩层
     * 不管调用几次遮罩都只会创建一个遮罩
     */
    HW.Pop.mask.Create = function() {
        if (HW.Pop.mask.mask == null) {
            var mask = $('<div id="HW_mask"></div>');
            mask.width(HW.View.screenWidth).height(HW.View.screenHeight);
            HW.View.AddResetSizeHandel(function() {
                var HWMask = $('#HW_mask');
                if (HWMask.length == 0)
                    return false;
                HWMask.width(HW.View.screenWidth).height(HW.View.screenHeight);
                return true;
            });
            HW.Document.body.append(mask);
            mask.css('display', 'none');
            mask.fadeIn(400);
            HW.Pop.mask.mask = mask;
        }
        HW.Pop.mask.count.push(0);
    }
    /**
     * 消除遮罩
     * 创建了几次遮罩就需要调用几次Remove才可以消除
     */
    HW.Pop.mask.Remove = function() {
        if (HW.Pop.mask.mask == null)
            return;
        if (HW.Pop.mask.count.length > 0)
            HW.Pop.mask.count.pop();
        if (HW.Pop.mask.count.length == 0) {
            HW.Pop.mask.mask = null;
            $('#HW_mask').fadeOut('400', function() {
                $(this).remove();
            });
        }
    }

    HW.Pop.message.color = {};
    HW.Pop.message.color.Red = '#E74C3C';
    HW.Pop.message.color.Blue = '#2980B9';
    HW.Pop.message.color.Black = '#2C3E50';

    /**
     * 初始化消息框
     * 一个页面中只能有一个消息框 如果添加多个消息框 则会新内容覆盖旧内容
     * _P:{}
     * _P:.title:string 弹窗提示  默认为 '提示'
     * _P.text:string 消息内容
     * _P.color:#FFF 消息颜色
     */
    HW.Pop.init.dialogInit = function(_P) {
        if (typeof _P.color === 'undefined')
            _P.color = HW.Pop.message.color.Black;
        if (typeof _P.title === 'undefined')
            _P.title = '提示';
        var box = $('#HW_box');
        if (box.length > 0) {
            box.find('.HW_box_msg').eq(0).text(_P.text);
            box.find('.HW_box_title').eq(0).text(_P.title);
            return box;
        } else
            box = $('<div id="HW_box"></div>');

        var boxTitle = $('<span class="HW_box_title">' + _P.title + '</span>');
        var boxCloseBut = $('<span class="HW_close_but">X</span>');
        var boxContent = $('<div class="HW_box_msg HW_box_msg_color_black"></div>');
        boxContent.text(_P.text);

        box.append(boxTitle);
        box.append(boxCloseBut);
        box.append(boxContent);

        HW.Pop.mask.Create();

        box.css({
            left: HW.View.screenWidth / 2 - box.width() / 2,
            top: HW.View.screenHeight / 2 - box.height() / 2
        });

        setTimeout(function() {
            boxCloseBut.click(HW.Pop.message.Close());
            HW.Pop.Move({
                target: '#HW_box>.HW_box_title',
                parent: '#HW_box'
            });
        }, 100);

        return box;
    }
    /**
     * 创建一个消息框
     * 一个页面中只能有一个消息框 如果添加多个消息框 则会新内容覆盖旧内容
     * _P:{}
     * _P:.title:string 弹窗提示  默认为 '提示'
     * _P.text:string 消息内容
     * _P.butText:string 按钮文字 默认为 '确定'
     * _P.color:#FFF 消息颜色
     * _P.fun 回调函数
     */
    HW.Pop.message.Create = function(_P) {

        if (typeof _P === 'undefined' || typeof _P.text !== 'string')
            return;
        var box = HW.Pop.init.dialogInit(_P);
        if (typeof _P.butText === 'undefined')
            _P.butText = '确定';
        var boxBut = $('<span class="HW_box_but HW_box_msg_but">' + _P.butText + '</span>');
        boxBut.click(HW.Pop.message.Close(_P));

        box.append(boxBut);

        HW.Document.body.append(box);
        box.fadeIn(200);
    }
    /**
     * 关闭消息窗体事件
     * _P:{}
     * _P.fun:function 回调函数
     */
    HW.Pop.message.Close = function(_P) {
        var fun = null;
        if (typeof _P !== 'undefined' && typeof _P.fun !== 'undefined')
            fun = _P.fun;
        return function() {
            $(this).parents('#HW_box').fadeOut(400, function() {
                $(this).remove();
            });
            HW.Pop.mask.Remove();
            if (fun != null)
                fun();
        }
    }
    /**
     * 创建一个消息框
     * 一个页面中只能有一个消息框 如果添加多个消息框 则会新内容覆盖旧内容
     * _P:{}
     * _P:.title:string 弹窗提示  默认为 '提示'
     * _P.text:string 消息内容
     * _P.okText:string 按钮文字 默认为 '确定'
     * _P.cancelText:string 按钮文字 默认为 '取消'
     * _P.color:#FFF 消息颜色
     * _P.ok:function 确定按钮点击事件
     * _P.cancel:function 取消按钮点击事件
     */
    HW.Pop.dialog.Create = function(_P) {

        if (typeof _P === 'undefined' || typeof _P.text !== 'string')
            return;

        var box = HW.Pop.init.dialogInit(_P);

        if (typeof _P.okText === 'undefined')
            _P.okText = '确定';
        if (typeof _P.cancelText === 'undefined')
            _P.cancelText = '取消';

        var boxOkBut = $('<span class="HW_box_but HW_box_ok_but">' + _P.okText + '</span>');
        var boxCancelBut = $('<span class="HW_box_but HW_box_cancel_but">' + _P.cancelText + '</span>');

        boxOkBut.click(HW.Pop.dialog.Close(_P));
        boxCancelBut.click(HW.Pop.dialog.Close(_P));

        box.append(boxOkBut);
        if(_P.cancelText!='')
            box.append(boxCancelBut);

        HW.Document.body.append(box);
        box.fadeIn(200);

    }
    /**
     * 关闭消息窗体事件
     * _P:{}
     * _P.ok:function 确定按钮回调函数
     * _P.cancel:function 取消按钮回调函数
     */
    HW.Pop.dialog.Close = function(_P) {
        var ok = null;
        var cancel = null;

        if (typeof _P.ok !== 'undefined')
            ok = _P.ok;
        if (typeof _P.cancel !== 'undefined')
            cancel = _P.cancel;

        return function() {

            $(this).parents('#HW_box').fadeOut(400, function() {
                $(this).remove();
            });
            HW.Pop.mask.Remove();

            if ($(this).hasClass('HW_box_ok_but')) {
                if (ok != null)
                    ok();
            } else {
                if (cancel != null)
                    cancel();
            }
        }

    }
    /**
     * 使弹出层可拖动
     * _P:{}
     * _P.target : id 按下时的目标
     * _P.parent : id 父级 默认为null 为null 时使target可拖动
     * _P.overflow : Boolean 是否可拖出屏幕范围 默认为false 不可拖出
     */
    HW.Pop.Move = function(_P) {

        if (typeof _P === 'undefined' || typeof _P.target === 'undefined')
            return;
        if (typeof _P.overflow === 'undefined')
            _P.overflow = false;

        _P.isMove = false;

        var moveObj = null;

        var isParent = true;
        if (typeof _P.parent === 'undefined' || _P.target == _P.parent) {
            isParent = false;
        }

        moveObj = $(_P.target).eq(0);
        if (!isParent) {
            moveObj.css('position', 'fixed');
        } else {
            moveObj.parents(_P.parent).css('position', 'fixed');
        }

        moveObj.mousedown(function(event) {

            _P.isMove = true;

            var pageX = event.pageX;
            var pageY = event.pageY;
            moveObj.offsetX = pageX - moveObj.offset().left + HW.View.window.scrollLeft();
            moveObj.offsetY = pageY - moveObj.offset().top + HW.View.window.scrollTop();

        });
        moveObj.mouseup(function(event) {
            _P.isMove = false;
        });

        moveObj.mousemove(function(event) {
            if (!_P.isMove)
                return;

            var offX = event.pageX - moveObj.offsetX;
            var offY = event.pageY - moveObj.offsetY;

            if (offX <= 0 || offY <= 0)
                return;

            var objWidth = moveObj.parents(_P.parent).eq(0).outerWidth(true);
            var objHeight = moveObj.parents(_P.parent).eq(0).outerHeight(true);
            if (!isParent) {
                objWidth = moveObj.outerWidth(true);
                objHeight = moveObj.outerHeight(true);
            }

            var maxX = HW.View.screenWidth - objWidth;
            var maxY = HW.View.screenHeight - objHeight;

            if (offX >= maxX || offY >= maxY)
                return;

            var m = moveObj.parents(_P.parent).eq(0);
            if (!isParent)
                m = moveObj;
            m.css({
                top: offY,
                left: offX
            });
        });
    }

    HW.Pop.progress.Create = function(plan) {
        progressWind(plan);

        function progressWind(plan) {
            plan = parseInt(plan);
            var progress = $('#HW_progress');
            if (progress.length < 1) {
                progress = createProgressWind();
            }

            progress.find('.plan').eq(0).text(plan + '%');
            progress.find('.bor>.pro').eq(0).css('width', plan + '%');
            if (plan >= 100) {
                progress.remove();
                HW.Pop.mask.Remove();
                HW.Pop.message.Create({
                    text: '上传完成'
                });
            }
        }

        function createProgressWind() {
            var progress = $('<div id="HW_progress"></div>');
            progress.append('<div class="bor"><div class="pro"></div></div>')
            progress.append('<p>上传中请耐心等待：<span class="plan">0%</span></p>');
            HW.Pop.Center(progress);
            HW.Pop.mask.Create();
            HW.Document.body.append(progress)
            return progress;
        }
    }
    HW.Pop.Center = function(tar) {
        tar.css('position', 'fixed');
        var left = HW.View.screenWidth / 2 - tar.width() / 2;
        if (HW.View.screenHeight < 400) {
            tar.css({
                'top': '0',
                left: left
            });
        } else {
            tar.css({
                'top': HW.View.screenHeight / 2 - tar.height() / 2,
                left: left
            });
        }
    }
    /**
     * 创建文本输入框
     * _P:{}
     * _P:empty:boolean 是否允许为空 默认为false
     * _P:maxLength:int 最多允许输入的文本长度
     * _P:minLength:int 最少允许输入的文本长度
     * _P:topic:string 输入提示文字
     * _P:text:string
     * _P:value:string 默认的内容
     * _P:type 输入框的类型  一般默认为type,
     * _P:fun 回调函数
     */
    HW.Pop.textDailog.Create = function(_P) {
        if (typeof _P === 'undefined')
            return;
        var box = HW.Pop.init.dialogInit(_P);
        if (typeof _P.butText === 'undefined')
            _P.butText = '确定';
        var boxBut = $('<span class="HW_box_but HW_box_msg_but">' + _P.butText + '</span>');
        box.append(boxBut);

        _P.topic = typeof _P.topic === 'undefined' ? '请输入内容' : _P.topic;
        _P.empty = typeof _P.empty === 'undefined' ? false : _P.empty;
        _P.maxLength = typeof _P.maxLength !== 'number' ? 50 : _P.maxLength;
        _P.minLength = typeof _P.minLength !== 'number' ? 0 : _P.minLength;
        _P.text = typeof _P.text !== 'string' ? _P.topic : _P.text;
        _P.value = typeof _P.value !== 'string' ? '' : _P.value;
        _P.type = typeof _P.type !== 'string' ? 'text' : _P.type;


        var input = $('<input type="text" class="HW_box_input"/>');
        input.attr({
            'placeholder': _P.topic,
            'maxlength': _P.maxLength,
            'type': _P.type
        }).val(_P.value);

        box.append(input);
        var proText = $('<span class="HW_input_pro"></span>');
        box.append(proText);

        HW.Document.body.append(box);
        boxBut.click((function(_P, input, proText) {
            return function() {
                var val = $.trim(input.val());
                var checkResult = "";
                if ((checkResult = check(_P)) !== true) {
                    input.css('border:1px solid #FF4242');
                    proText.text(checkResult);
                    return;
                } else {
                    input.css('border:1px solid #DDD');
                    proText.text('');
                }

                if (typeof _P.fun === 'function')
                    _P.fun(val);
                box.remove();
                HW.Pop.mask.Remove();
                function check(_P) {
                    if (!_P.empty && val == '')
                        return '不能为空';
                    if (val.length < _P.minLength)
                        return '必须输入' + _P.minLength + '个以上的字符';
                    if (val.length > _P.maxLength)
                        return '只能输入' + _P.minLength + '个以内的字符';
                    return true;
                }

            }
        })(_P, input, proText));
        setTimeout(function() {
            input.focus();
        }, 200);
        box.fadeIn(200);
    }
    // ----------------控件组件--------------------
    HW.Widget.switchRoll = {
        Load: function() {}, //加载控件
        AutoLoad: function() {}, //自动加载页面中所有控件
        ButClick: function() {}, //圆点、数字按钮点击
        LRButClick: function() {} //左右按钮点击事件
    }; //切换滚动轮播展示控件
    HW.Widget.selectOption = {
        Create: function() {} //创建操作select的对象 使用new进行创建
    }; //下拉选项框
    HW.Widget.table = {
        Create: function() {} //创建表格控件 使用new进行创建
    }; //表格控件
    HW.Widget.upload = {
        Create: function() {} // 构造函数
    }; //文件上传控件
    /**
     * 自动加载所有切换滚动展示控件
     * 控件必须使用带有id的标签包裹起来才能使用自动加载
     * 否则将会忽略
     */
    // *********************暂停开发*************************************
    // HW.Widget.switchRoll.AutoLoad = function() {
    //         var allSwitchRoll=$('.HW_switch_roll');
    //         for(var i=0;i<allSwitchRoll.length;i++){
    //             var parent=allSwitchRoll.eq(i).parent();
    //             var selector='';
    //             if(typeof parent.attr('id')!=='undefined'){
    //                 selector=parent.attr('id');
    //             }else{
    //                 continue;
    //             }

    //         }
    //     }
    /**
     * 加载切切换滚动展示控件
     * _W:{}
     * _W.target: Jq select 选中的对象只能为.HW_switch_roll
     * _W.lrBut:Boolean 是否开启左右切换按钮
     * _W.numBut:Boolean 是否开启数字切换按钮
     * _W.pointBut:Boolean 是否开启居中圆点切换按钮
     * _W.des:Boolean 是否开启面板底部描述
     * _W.auto:Boolean 是否自动轮播
     * _W.autospeed:int 自动切换速度 默认为3000毫秒
     * _W.change:function 面板发生切换事触发的事件
     */
    HW.Widget.switchRoll.Load = function(_W) {

        var switchRoll = $(_W.target).eq(0);

        var width = switchRoll.width();
        var height = switchRoll.height();

        _W.lrBut = typeof _W.lrBut !== 'boolean' ? true : _W.lrBut;
        _W.numBut = typeof _W.numBut !== 'boolean' ? true : _W.numBut;
        _W.pointBut = typeof _W.pointBut !== 'boolean' ? true : _W.pointBut;
        _W.des = typeof _W.des !== 'boolean' ? true : _W.des;
        _W.auto = typeof _W.auto !== 'boolean' ? true : _W.auto;
        _W.autospeed = typeof _W.autospeed === 'number' ? _W.autospeed : 3000;
        _W.change = typeof _W.change !== 'function' ? HW.NULLF : _W.change;

        var contentBlock = {
            lrBut: null,
            numBut: null,
            pointBut: null,
            des: null,
            contents: switchRoll.find('.contents')
        };

        var count = contentBlock.contents.length;
        switchRoll.attr({
            'c': count,
            'i': 0
        });

        if (_W.lrBut || _W.auto) {
            contentBlock.lrBut = {
                left: $('<div class="HW_switch_left_but switch_left_but">&lt;</div>'),
                right: $('<div class="HW_switch_right_but switch_right_but">&gt;</div>')
            };

            switchRoll.append(contentBlock.lrBut.left);
            switchRoll.append(contentBlock.lrBut.right);
            contentBlock.lrBut.left.css('line-height', height + 'px');
            contentBlock.lrBut.right.css('line-height', height + 'px');

            contentBlock.lrBut.right.click(HW.Widget.switchRoll.LRButClick(_W));
            contentBlock.lrBut.left.click(HW.Widget.switchRoll.LRButClick(_W));

            if (!_W.lrBut) {
                contentBlock.lrBut.right.css('opacity', '0');
                contentBlock.lrBut.left.css('opacity', '0');
            }
        }

        if (_W.auto) {
            (function() {
                var fun = (function() {

                    var parent = switchRoll;
                    var countx = count;
                    var isRight = true;

                    return function() {
                        var index = parseInt(parent.attr('i'));

                        if (-index == countx - 1)
                            isRight = false;
                        if (index == 0)
                            isRight = true;

                        if (isRight)
                            contentBlock.lrBut.right.click();
                        else
                            contentBlock.lrBut.left.click();
                    }
                })();

                var interval = setInterval(fun, _W.autospeed);

                switchRoll.hover(function() {
                    if (interval != null)
                        clearInterval(interval);
                }, function() {
                    interval = setInterval(fun, _W.autospeed);
                });
            })();
        }

        var switchBlocks = $('<div class="HW_switch_blocks switch_blocks"></div>');
        for (var i = 0; i < count; i++) {
            var temp = $('<div class="HW_switch_block switch_block"></div>');
            if (_W.des) {
                temp.attr('des', contentBlock.contents.eq(i).find('.des').eq(0).text());
            }
            temp.html(contentBlock.contents.eq(i).find('.text').eq(0).html());
            switchBlocks.append(temp);
            temp.css('width', width);
            contentBlock.contents.eq(i).remove();
        }
        switchBlocks.width(width * count);
        switchRoll.append(switchBlocks);

        if (_W.numBut) {
            contentBlock.numBut = $('<div class="HW_switch_num_buts switch_num_buts"></div>');
            for (var i = 0; i < count; i++) {
                var but = $('<div class="HW_switch_num_but switch_num_but" step="' + i + '">' + (i + 1) + '</div>')
                contentBlock.numBut.append(but);
            }
            contentBlock.numBut.click(HW.Widget.switchRoll.ButClick(_W));
            switchRoll.append(contentBlock.numBut);
        }

        if (_W.pointBut) {
            contentBlock.pointBut = $('<div class="HW_switch_point_buts"></div>');
            for (var i = 0; i < count; i++) {
                contentBlock.pointBut.append('<div class="HW_switch_point_but" step="' + i + '"></div>');
            }
            contentBlock.pointBut.click(HW.Widget.switchRoll.ButClick(_W));
            switchRoll.append(contentBlock.pointBut);
            contentBlock.pointBut.css('left', (width - contentBlock.pointBut.width()) / 2);
        }

        if (_W.des) {
            contentBlock.des = $('<div class="HW_switch_bottom_text switch_bottom_text"></div>');
            contentBlock.des.text($.trim(switchBlocks.find('.HW_switch_block').eq(0).attr('des')));
            switchRoll.append(contentBlock.des);
        }

    }
    /**
     * 左右按钮切换按钮事件
     * _W:{}
     * _W.des 是否带有底部描述文字切换
     */
    HW.Widget.switchRoll.LRButClick = function(_W) {

        var des = typeof _W.des === 'boolean' ? _W.des : false;
        var parent = null;
        var switchBlocks = null;
        var desText = null;

        return function() {
            if (parent == null)
                parent = $(this).parents('.HW_switch_roll').eq(0);
            var count = parent.attr('c');
            var index = parseInt(parent.attr('i'));

            var width = parent.width();
            var height = parent.height();

            var switchBlock = null;

            if (switchBlocks == null)
                switchBlocks = parent.find('.HW_switch_blocks').eq(0);

            if ($(this).hasClass('HW_switch_right_but')) {
                if (-index == count - 1)
                    return;
                switchBlocks.animate({
                    left: parseInt(switchBlocks.css('left')) - width
                }, 400);
                parent.attr('i', index - 1);

                switchBlock = switchBlocks.find('.HW_switch_block').eq(-index + 1);

                if (des) {
                    if (desText == null)
                        desText = parent.find('.HW_switch_bottom_text').eq(0);
                    if (typeof switchBlock.attr('des') !== 'undefined')
                        desText.text($.trim(switchBlock.attr('des')));
                }
            } else {
                if (index == 0)
                    return;
                switchBlocks.animate({
                    left: parseInt(switchBlocks.css('left')) + width
                }, 400);
                parent.attr('i', index + 1);

                switchBlock = switchBlocks.find('.HW_switch_block').eq(-index - 1);

                if (des) {
                    if (desText == null)
                        desText = parent.find('.HW_switch_bottom_text').eq(0);
                    if (typeof switchBlock.attr('des') !== 'undefined')
                        desText.text($.trim(switchBlock.attr('des')));
                }
            }
            _W.change(switchBlock.index(), switchBlock);
        }
    }
    /**
     * 数字、圆点按钮点击事件
     * _W:{}
     * _W.des 是否带有底部描述文字切换
     */
    HW.Widget.switchRoll.ButClick = function(_W) {

        var des = typeof _W.des === 'boolean' ? _W.des : false;
        var parent = null;
        var switchBlocks = null;
        var desText = null;

        return function(event) {
            if (parent == null)
                parent = $(this).parents('.HW_switch_roll').eq(0);
            var target = $(event.target || event.srcElement);

            if (target.hasClass('HW_switch_point_buts') || target.hasClass('HW_switch_num_buts'))
                return;

            var step = parseInt(target.attr('step'));
            if (switchBlocks == null)
                switchBlocks = parent.find('.HW_switch_blocks').eq(0);
            switchBlocks.animate({
                left: -(step * parent.width())
            }, 300);

            var switchBlock = switchBlocks.find('.HW_switch_block').eq(step);

            if (des) {
                if (desText == null)
                    desText = parent.find('.HW_switch_bottom_text').eq(0);
                if (typeof switchBlock.attr('des') !== 'undefined')
                    desText.text($.trim(switchBlock.attr('des')));
            }
            parent.attr('i', -step);
            _W.change(switchBlock.index(), switchBlock);
        }
    }
    /**
     * 创建select option控件 构造函数
     * 该控件使用new 关键字进行创建
     * _W:{}
     * _W:target Jq selector 要创建的对象
     * _W:defaultNum : int|Boolean 是否使用数字索引 作为val 默认为0
     * _W:selectedItem : int 默认选中的项 默认为0 该值大于0时有效
     * _W:change : function 当选中项发生改变时 在该函数中可以使用this来指向当前对象
     */
    HW.Widget.selectOption = function(_W) {

        this.select = $(_W.target);
        if (this.select.length < 1)
            return null;

        if (_W.defaultNum !== false) {
            _W.defaultNum = typeof _W.defaultNum === 'boolean' ? 0 : typeof _W.defaultNum === 'undefined' ? 0 : typeof _W.defaultNum === 'number' ? _W.defaultNum : 0;
        }
        _W.selectedItem = typeof _W.selectedItem === 'undefined' ? 0 : typeof _W.selectedItem === 'number' ? _W.selectedItem : 0;

        this.change = typeof _W.change !== 'function' ? null : _W.change;
        this.select = this.select.eq(0);
        this.height = this.select.outerHeight();
        this.selectIndex = 0;
        this.showState = false; //关闭 当前下拉框的打开状态

        /**
         * 获得所有选项
         */
        this.getItems = function() {
            var items = this.select.find('.item');
            if (items.length < 1)
                items = this.select.find('.HW_select_item');
            if (items.length < 1){
                return [];
            }
            return items;
        }
        //所有选项
        this.items = this.getItems();
        this.itemsCount = 0;

        //项目为空时初始化空选择器
        if(this.items.length==0){
            this.select.html('<div class="HW_select_default_item HW_select_no_item" val="" style="height: '
                +this.height+'px; line-height: '
                +this.height+'px;">没有数据</div>');
            return null;
        }
        /**
         * 使用初始化的item生成item
         * 返回生成的item
         */
        this.createDefaultItem = function() {
            var items = this.items;
            if (items.length < 1)
                return [];

            //是否为数字值
            var isNumVal = true;
            var numValIndex = 0;

            if (_W.defaultNum !== false) {
                numValIndex = parseInt(_W.defaultNum);
                this.selectIndex = _W.selectedItem;
            } else {
                isNumVal = false;
                //如果没有设置对应的val的话默认从0开始作为选项的val
                if (typeof items.eq(0).attr('val') !== 'undefined') {
                    numValIndex = parseInt($.trim(items.eq(0).attr('val')));
                }
            }

            if (typeof numValIndex === 'NaN') {
                isNumVal = false;
            }
            var options = $('<div class="HW_select_options"></div>');
            for (var i = 0; i < items.length; i++) {
                var temp = $('<div class="HW_select_item"></div>');
                if (isNumVal) {
                    temp.attr('val', numValIndex++);
                } else {
                    temp.attr('val', items.eq(i).attr('val'));
                }
                temp.html(items.eq(i).text());
                options.append(temp);
                items.eq(i).remove();
                this.items[i] = temp;
                this.itemsCount += 1;
            }

            return options;
        }
        //创建默认item
        this.options = this.createDefaultItem();
        /**
         * 是否有默认选项
         * 有则返回默认选项 否则返回fasle
         */
        this.hasDefault = function() {
            var defaultItem = this.select.find('.default').eq(0);
            var defaultItemx = this.select.find('.HW_select_default_item').eq(0);
            var item = defaultItem.length > 0 ? defaultItem : defaultItemx;

            if (item.length < 1)
                return false;
            else
                return item;
        }

        this.selectedItem = null;
        //没有默认选项时 则使用第一个选项作为默认选项
        if ((this.selectedItem = this.hasDefault()) === false) {
            this.selectedItem = $('<div class="HW_select_default_item"></div>');
            this.selectedItem.attr('val', this.items[0].attr('val')).html(this.items[0].html());
        } else {
            var temp = this.selectedItem;
            this.selectedItem = $('<div class="HW_select_default_item"></div>');
            this.selectedItem.attr('val', temp.attr('val')).html(temp.html());
            temp.remove();
        }
        this.selectedItem.addClass('HW_select_no_item');
        this.selectedItem.height(this.height).css('line-height', this.height + 'px');
        //如果指定了默认选中项则设置
        if (typeof _W.selectedItem === 'number' && _W.selectedItem > 0) {
            this.selectedItem.attr('val', this.items[_W.selectedItem - 1].attr('val')).html(this.items[_W.selectedItem - 1].html());
            this.selectIndex = _W.selectedItem;
        }
        /**
         * 当前选中项点击事件
         */
        this.selectedItemClickAction = function() {
            var options = this.options;
            var height = this.select.height();
            var count = this.itemsCount;
            var selectedItem = this.selectedItem;
            var x = this;
            return function(event) {
                if ($(this).hasClass('HW_select_no_item')) {
                    x.options.animate({
                        height: count * height
                    }, 300).css('border','1px solid #A1A1A1');
                    x.selectedItem.removeClass('HW_select_no_item').addClass('HW_select_is_item');
                    x.showState = true;
                } else {
                    x.options.animate({
                        height: 0
                    }, 300).css('border','none');
                    x.selectedItem.removeClass('HW_select_is_item').addClass('HW_select_no_item');
                    x.showState = false;
                }
            }
        }
        this.selectedItem.click(this.selectedItemClickAction());
        /**
         * items点击事件
         */
        this.optionsClickAction = function() {
            var x = this;
            return function(event) {
                var target = $(event.target || event.srcElement);
                if (!target.hasClass('HW_select_item'))
                    return;

                x.selectIndex = target.index();

                x.selectedItem.attr('val', target.attr('val')).html(target.html())
                    .removeClass('HW_select_is_item').addClass('HW_select_no_item');
                $(this).animate({
                    height: 0
                }, 300);
                x.showState = false;
                if (x.change != null)
                    x.change();
            }
        }
        this.options.click(this.optionsClickAction());

        this.select.append(this.selectedItem);
        this.select.append(this.options);

        /**
         * 获得当前选中项的值
         */
        this.getValue = function() {
            return this.selectedItem.attr('val');
        }

        /**
         * 获得当前选中项的文本
         */
        this.getText = function() {
            return $.trim(this.selectedItem.html());
        }
        /**
         * 获得选中项的索引
         */
        this.getIndex = function() {
            return this.selectIndex;
        }
        /**
         * 设置当前选中项的值
         */
        this.setValue = function(val) {
            this.selectedItem.attr('val', val);
        }

        /**
         * 设置当前选中项的文本
         */
        this.setText = function(text) {
            this.selectedItem.html(text);
        }

        /**
         * 获得选项中的一项
         */
        this.getItem = function(index) {
            if (index >= this.items.length)
                return null;
            return this.items[index];
        }

        /**
         * 设置选项中的一项的值和文本
         * 如果不设置则传入null
         * setItem(0,null,'hello') 则设置第0项的文本为hello 不改变值
         */
        this.setItem = function(index, val, text) {
            if (index >= this.items.length)
                return null;
            if (val == null)
                this.items[index].html(text);
            else if (typeof text === 'undefined' || text == null)
                this.items[index].attr('val', val);
            else
                this.items[index].attr('val', val).html(text);
        }

        /**
         * 获得某一选项的值
         */
        this.getItemVal = function(index) {
            if (index >= this.items.length)
                return null;
            return this.items[index].attr('val');
        }

        /**
         * 获得某一选项的文本
         */
        this.getItemText = function(index) {
            if (index >= this.items.length)
                return null;
            return $.trim(this.items[index].html());
        }

        /**
         * 展开选项
         */
        this.showItems = function() {
            if (this.showState == false) {
                this.selectedItem.click();
                this.showState = true;
            }
        }
        //关闭选项
        this.closeItems = function() {
            if (this.showState == true) {
                this.selectedItem.click();
                this.showState = false;
            }
        }
    }

    /**
     * 创建表格控件
     * _W:{}
     * _W.target: jq selectort
     * _W.tr_attr:[] 行属性
     * _W.td_attr:[] 列属性
     * _W.autoHead:Boolean 是否将第一行设为表头 默认为true
     * _W.width:[] 列宽 如果未指定则平均分配宽度 该配置在360浏览器中可能会出现剩余宽度设置过多的问题 如果使用则请设置所有列宽
     * _W.rowClick:function 列点击事件
     * _W.lineClick:function 行点击事件 执行行点击事件时会自动触发列点击事件
     * _W.fieldClick:function 字段点击事件 默认会执行对列排序
     * _W.fieldSort:function 字段排序函数
     *     默认当点击字段时会对该列进行排序 如果为列值为数字则按照大小排序 反之按照字符串长度排序
     *     如果需要对该函数覆盖的话
     *         该函数默认传入两个参数 分别为两个列对象 自行对其的值进行判断
     *         该函数必须返回一个Bolean值
     *         当a值大于b值 返回true 则为升序
     *         当a值小于b值 返回false 则为降序
     * _W.fieldSortMethod:Boolean 排序方式 true为升 false为降 默认为true
     * _W.sort:Boolean 是否开启点击字段时对表格进行排序默认为 true 开启
     * _W.sortField:int 初始化后的排序的字段索引 默认为0 只有当_W.loadSort为true时该项有效
     * _W.loadSort:Boolean 是否开启初始化后 对表字段进行排序
     * _W.lineMouserEnter:function 鼠标进入行事件
     * _W.lineMouserLeave:function 鼠标离开行事件
     * _W.rowMouserEnter:function 鼠标进入列事件
     * _W.rowMouserLeave:function 鼠标离开列事件
     * _W.ctrlBut:{} 配置表格操作按钮
     *      butText:['修改','删除'],
     *      butClick:[function(index,but,data){},function(index,but,data){}]
     * _W.delBut:function 使用使用行删除按钮 默认为使用 不使用则传入false
     * delBut函数必须返回true or fasle 表示删除成功或者失败
     */
    HW.Widget.table.Create = function(_W) {
        this.table = $(_W.target).eq(0);
        if (this.table.length < 1)
            return null;

        _W.tr_attr = typeof _W.tr_attr === 'undefined' ? [] : _W.tr_attr;
        _W.td_attr = typeof _W.td_attr === 'undefined' ? [] : _W.td_attr;
        _W.autoHead = typeof _W.autoHead !== 'boolean' ? true : _W.autoHead;
        _W.width = typeof _W.width === 'undefined' ? [] : _W.width;
        _W.rowClick = typeof _W.rowClick !== 'function' ? HW.NULLF : _W.rowClick;
        _W.lineClick = typeof _W.lineClick !== 'function' ? HW.NULLF : _W.lineClick;
        _W.fieldClick = typeof _W.fieldClick !== 'function' ? HW.NULLF : _W.fieldClick;
        _W.fieldSort = typeof _W.fieldSort !== 'function' ? null : _W.fieldSort;
        // _W.fieldSortMethod = typeof _W.fieldSortMethod !== 'boolean' ? true : _W.fieldSortMethod;
        _W.sort = typeof _W.sort !== 'boolean' ? true : _W.sort;
        _W.sortField = typeof _W.sortField !== 'number' ? 0 : _W.sortField;
        _W.loadSort = typeof _W.loadSort !== 'boolean' ? true : _W.loadSort;
        _W.lineMouserEnter = typeof _W.lineMouserEnter === 'undefined' ? HW.NULLF : _W.lineMouserEnter;
        _W.lineMouserLeave = typeof _W.lineMouserLeave === 'undefined' ? HW.NULLF : _W.lineMouserLeave;
        _W.rowMouserEnter = typeof _W.rowMouserEnter === 'undefined' ? HW.NULLF : _W.rowMouserEnter;
        _W.rowMouserLeave = typeof _W.rowMouserLeave === 'undefined' ? HW.NULLF : _W.rowMouserLeave;
        _W.ctrlBut = typeof _W.ctrlBut === 'undefined' ? {
            butText: [],
            butClick: []
        } : _W.ctrlBut;
        _W.delBut = typeof _W.delBut === 'undefined' ? function() {
            return true;
        } : _W.delBut;

        _W.fieldSortMethod = true;

        this._W = _W;

        if (_W.delBut != null) {
            this._W.ctrlBut.butText[this._W.ctrlBut.butText.length] = '删除';
            this._W.ctrlBut.butClick[this._W.ctrlBut.butClick.length] = (function(x) {
                return function(index, but, data, line) {
                    HW.Pop.dialog.Create({
                        title: '删除提示',
                        text: '确定删除该行吗？',
                        ok: (function(index, but, data, line) {
                            return function() {
                                if (x._W.delBut(index, but, data, line)) {
                                    x._delButClick(index, but, data, line);
                                }
                            }
                        })(index, but, data, line)
                    });
                }
            })(this);
        }

        this._showCtrlBut = function(line) {

            if (this._W.ctrlBut.butText.length < 1)
                return;

            var buts = $('<div class="HW_table_ctrls"></div>');
            for (var i = 0; i < this._W.ctrlBut.butText.length; i++) {
                var but = $('<div class="HW_table_ctbut">' + this._W.ctrlBut.butText[i] + '</div>');
                buts.append(but);
            }
            if (_W.delBut != null) {
                buts.children().eq(this._W.ctrlBut.butText.length - 1).css('background-color', '#FF4242');
            }
            line.append(buts);
        }

        var tempTr = this.table.find('tr');
        this.createDefaultTr = function() {
            var lines = [];
            for (var i = 0; i < tempTr.length; i++) {
                var line = $('<div class="HW_table_line"></div>');
                var tempTd = tempTr.eq(i).find('td');
                //写入列属性
                if (_W.tr_attr.length > 0) {
                    for (var l = 0; l < _W.tr_attr.length; l++) {
                        if (typeof tempTr.eq(i).attr(_W.tr_attr[l]) !== 'undefined')
                            line.attr(_W.tr_attr[l], tempTr.eq(i).attr(_W.tr_attr[l]));
                    }
                }

                for (var o = 0; o < tempTd.length; o++) {
                    var row = $('<span class="HW_table_row"></span>');
                    if (_W.td_attr.length > 0) {
                        for (var q = 0; q < _W.td_attr.length; q++) {
                            if (typeof tempTd.eq(o).attr(_W.td_attr[q]) !== 'undefined')
                                row.attr(_W.td_attr[q], tempTd.eq(o).attr(_W.td_attr[q]));
                        }
                    }
                    row.html(tempTd.eq(o).html());
                    tempTd.eq(o).remove();
                    line.append(row);
                }
                this._showCtrlBut(line);
                tempTr.eq(i).remove();
                lines.push(line);
            }
            return lines;
        }

        this.table.children().remove();
        this.lines = this.createDefaultTr();

        for (var i = 0; i < this.lines.length; i++) {
            this.table.append(this.lines[i]);
        }
        if (_W.autoHead) {
            this.lines[0].removeClass('HW_table_line').addClass('HW_table_field').children('.HW_table_row').removeClass('HW_table_row').addClass('HW_table_fields');
            this.fieldCount = this.lines[0].children('.HW_table_fields').length;
        } else {
            this.fieldCount = this.lines[0].children('.HW_table_row').length;
        }

        _W.sortField = _W.sortField >= this.fieldCount ? 0 : _W.sortField;
        /**
         * 遍历所有行
         * _e:{}
         * _e:each:function 返回值： Boolean 为true则继续遍历 false 则跳出
         * 遍历函数该函数会自动传入当前行索引作为第一个参数
         * 当前行对象作为第2个参数
         */

        this.eachLine = function(_e) {
            if (typeof _e === 'undefined' || typeof _e.each !== 'function')
                return;
            for (var i = 0; i < this.lines.length; i++) {
                if (!_e.each(i, this.lines[i])) {
                    return false;
                    break;
                }
            }
            return true;
        }

        /**
         * 遍历一列
         * _e:{}
         * _e:index:int 要遍历的列索引 默认为0
         * _e:function 遍历函数 自动传入当前索引和 对象
         */
        this.eachOneLine = function(_e) {
            if (typeof _e === 'undefined' || typeof _e.index !== 'number')
                _e.index = 0;
            _e.each = typeof _e.each !== 'function' ? HW.NULLF : _e.each;

            if (_e.index >= this.lines.length || _e.index < 0) {
                return;
            }
            var rows = this.lines[_e.index].children();
            for (var i = 0; i > rows.length; i++) {
                _e.each(i, rows.eq(i));
            }
        }

        /**
         * 遍历所有列
         * _e:{}
         * _e:each:function 基于this.eachLine实现遍历所有列 返回值： Boolean 为true则继续遍历 false 则跳出
         * _e:withTitle:Boolean 是否遍历标题栏 默认为false 不遍历
         * 并自动传入当前列作索引为第一个参数  当前列对象作为第二个参数
         * 传入当前行索引作为第三个参数 当前行对象作为第四个参数
         */

        this.eachRow = function(_e) {
            if (typeof _e === 'undefined')
                return;
            _e.withTitle = typeof _e.withTitle !== 'boolean' ? false : _e.withTitle;
            this.eachLine({
                each: (function() {
                    var __e = _e;
                    return function(index, line) {
                        var rows = (index == 0 && __e.withTitle) ? line.children('.HW_table_fields') : line.children('.HW_table_row');
                        for (var l = 0; l < rows.length; l++) {
                            if (!__e.each(l, rows.eq(l), index, line)) {
                                return false;
                                break;
                            }
                        }
                        return true;
                    }
                })()
            });
        }
        /**
         * 遍历一列
         * _e:{}
         * _e:index:int 要遍历的列索引 默认为0
         * _e:withTitle:Boolean 是否遍历标题栏 默认为false 不遍历
         * _e:withTitle
         * _e:each:function 遍历函数 第一个参数为 索引(从0开始) 第二个为对象
         */
        this.eachOneRow = function(_e) {
            if (typeof _e === 'undefined' || typeof _e.index !== 'number')
                _e.index = 0;
            _e.withTitle = typeof _e.withTitle !== 'boolean' ? false : _e.withTitle;
            _e.each = typeof _e.each !== 'function' ? HW.NULLF : _e.each;

            if (_e.index >= (this.lines.length + (_e.withTitle ? 0 : 1)) || _e.index < 0) {
                return;
            }

            for (var i = 0; i < this.lines.length; i++) {
                var row = (i == 0 && _e.withTitle) ? this.lines[i].children('.HW_table_fields').eq(_e.index) : this.lines[i].children('.HW_table_row').eq(_e.index);
                if (row.length < 1)
                    continue;
                _e.each((_e.withTitle ? i : i - 1), row);
            }
        }


        /**
         * 当调用该函数时如果当前的this不是指向该对象的话 会自动寻找闭包变量X
         * line 要设置列宽的行
         * width:[] 指定的列宽 如果不指定则平均分配
         */
        this.setOneLineWidth = function(line, width, pad) {
            var pWidth = (this.table || x.table).width();

            width = typeof width === 'undefined' ? [] : width;
            pad = typeof pad !== 'boolean' ? true : pad;

            var rows = line.children('.HW_table_row').length > 0 ? line.children('.HW_table_row') : line.children('.HW_table_fields');
            if (rows.length < 0)
                return;

            //平均分列宽
            if (width.length < 1) {

                var tempRowWidth = pWidth / rows.length;

                for (var i = 0; i < rows.length; i++) {
                    var oiwidth = 0;
                    oiwidth = parseInt(rows.eq(i).css('margin-right')) + parseInt(rows.eq(i).css('margin-left'));
                    if (pad)
                        oiwidth += parseInt(rows.eq(i).css('padding-left')) + parseInt(rows.eq(i).css('padding-right'));
                    rows.eq(i).width(tempRowWidth - oiwidth);
                }

            } else {

                for (var i = 0; i < rows.length; i++) {
                    if (i < width.length) {
                        rows.eq(i).width(width[i] - (parseInt(rows.eq(i).css('margin-left')) + parseInt(rows.eq(i).css('margin-right'))));
                    } else {
                        var rowsWidth = 0;
                        for (var l = 0; l < i; l++) {
                            rowsWidth += rows.eq(l).outerWidth(true);
                        }
                        var tw = parseInt((line.width() - rowsWidth) / (rows.length - width.length));
                        for (var o = i; o < rows.length; o++) {
                            rows.eq(o).width(tw - (parseInt(rows.eq(o).css('margin-right')) + parseInt(rows.eq(o).css('margin-left'))));
                        }
                        break;
                    }
                }

            }
            // for(var i=0;i<rows.length;i++){
            //     rows.height(line.height());
            // }
        }

        /**
         * 自动根据配置参数设置宽度
         * width:[] 指定的宽度
         * 如果没传入该参数则根据配置参数设置
         * 如果没设置列宽则将剩余的宽度使用
         * 剩余宽度不够则直接隐藏
         */
        this.setLineWidth = function(width) {
            width = typeof width === 'undefined' ? _W.width : width;
            for (var i = 0; i < this.lines.length; i++) {
                this.setOneLineWidth(this.lines[i], width, true);
            }
        }
        this.setLineWidth(_W.width);

        /**
         * 行点击事件
         */
        this._lineClick = function(index, line) {
            this._W.lineClick(index, line);
        }

        /**
         * 列点击事件
         */
        this._rowClick = function(index, row) {
            this._W.rowClick(index, row);
        }

        /**
         * 交换行
         * 将row1 和 row2的位置相互替换
         */
        this.exchangeRow = function(row1, row2) {
            var temp1 = row1.clone(true, true);
            var temp2 = row2.clone(true, true);
            row1.replaceWith(temp2);
            row2.replaceWith(temp1);
        }

        /**
         * 交换列
         * 将line1 和 line2 进行交换
         */
        this.exchangeLine = function(line1, line2) {
            var temp1 = line1.html();
            var temp2 = line2.html();

            line1.html(temp2);
            line2.html(temp1);

            var tr_attr = this._W.tr_attr;
            if (tr_attr.length > 0) {
                for (var i = 0; i < tr_attr.length; i++) {
                    if (typeof line1.attr(tr_attr[i]) !== 'undefined' && typeof line2.attr(tr_attr[i]) !== 'undefined') {
                        var tempAttr = line1.attr(tr_attr[i]);
                        line1.attr(tr_attr[i], line2.attr(tr_attr[i]));
                        line2.attr(tr_attr[i], tempAttr);
                    }
                }
            }
        }
        /**
         * 字段点击事件
         */
        this._fieldClick = function(index, field) {
            this._W.fieldClick(index, field);

            //开启排序
            if (this._W.sort) {

                this._W.fieldSortMethod = !this._W.fieldSortMethod;
                if (this._W.fieldSortMethod) {
                    field.addClass('HW_SortDown').removeClass('HW_sortUp');
                    field.siblings().removeClass('HW_SortDown').removeClass('HW_sortUp');
                } else {
                    field.addClass('HW_sortUp').removeClass('HW_SortDown')
                    field.siblings().removeClass('HW_SortDown').removeClass('HW_sortUp');
                }

                var fieldSort = this._W.fieldSort || this._fieldSort;
                for (var i = 1; i < this.lines.length; i++) {
                    for (var l = 1; l < this.lines.length - i; l++) {

                        var row1 = this.lines[l].children().eq(index);
                        var row2 = this.lines[l + 1].children().eq(index);
                        var result = fieldSort(row1, row2);

                        result = this._W.fieldSortMethod ? !result : result;
                        if (result) {
                            this.exchangeLine(this.lines[l], this.lines[l + 1]);
                        }
                    }
                }
            }

        }
        /**
         * 默认的排序函数
         */
        this._fieldSort = function(a, b) {
            var val1 = parseInt(a.text());
            var val2 = parseInt(b.text());
            if (!isNaN(val1) && !isNaN(val2)) {
                if (val1 > val2) {
                    return true;
                } else {
                    return false;
                }

            } else {
                if (a.text().length > b.text().length)
                    return true;
                else
                    return false;
            }
        }

        this.ActionFunction = function(fun) {
            var x = this;
            return function(event) {
                var target = $(event.target || event.srcElement);
                fun.call(x, event, target);
            }
        }

        this.table.click(this.ActionFunction(function(event, target) {
            if (target.hasClass('HW_table_layout')) {} else if (target.hasClass('HW_table_line')) {
                this._lineClick(target.index(), target);
            } else if (target.hasClass('HW_table_row')) {
                this._rowClick(target.index(), target);
            } else if (target.hasClass('HW_table_fields')) {
                this._fieldClick(target.index(), target);
            } else if (target.hasClass('HW_table_ctbut')) {
                this._ctrlButClick(target.index(), target, this.getLineData(target.parents('.HW_table_line')), target.parents('.HW_table_line'));
            }
        }));

        /**
         * 表格控制按钮点击事件
         * index:int 按钮索引
         * but:jq 按钮对象
         * data:{} 行数据
         * line 触发的行对象
         */
        this._ctrlButClick = function(index, but, data, line) {
            if (this._W.ctrlBut.butClick.length < 1 || index > this._W.ctrlBut.butClick.length)
                return;
            if (typeof this._W.ctrlBut.butClick[index] !== 'function')
                return;
            this._W.ctrlBut.butClick[index](index, but, data, line);
        }
        /**
         * 删除按钮点击事件
         */
        this._delButClick = function(index, but, data, line) {
            this.lines.splice(line.index(), 1);
            line.animate({
                    height: 0
                },
                400,
                function() {
                    $(this).remove()
                });
        }
        /**
         * 获得行数据
         * line 行对象
         */
        this.getLineData = function(line) {
            var tr_attr = this._W.tr_attr;
            var data = {};
            for (var i = 0; i < tr_attr.length; i++) {
                if (typeof line.attr(tr_attr[i]) !== 'undefined') {
                    data[tr_attr[i]] = line.attr(tr_attr[i]);
                }
            }
            return data;
        }
        /**
         * 获得指定行指定列对象
         * lIndex 行索引
         * rIndex 列索引
         */
        this.getOneRow = function(lIndex, rIndex) {
            if (typeof lIndex === 'undefined' || isNaN(lIndex) || isNaN(rIndex) || typeof rIndex === 'undefined')
                return null;
            if (lIndex >= this.lines.length || rIndex >= this.lines[lIndex].children().length)
                return null;
            return this.lines[lIndex].children().eq(rIndex);
        }

        /**
         * 添加一行新数据
         * _a:{}
         * _a:data:[]
         * _a:width:[]
         * _a:td_attr:{key:value}
         * _a:tr_attr:{key:value}
         */
        this.addOneRow = function(_a) {


            if (typeof _a.data === 'undefined') {
                return;
            }

            if (_a.data.length < this.fieldCount) {
                return;
            }

            _a.td_attr = typeof _a.td_attr === 'undefined' ? {} : _a.td_attr;
            _a.tr_attr = typeof _a.tr_attr === 'undefined' ? {} : _a.tr_attr;
            _a.width = typeof _a.width === 'undefined' ? [] : _a.width;

            var line = $('<div class="HW_table_line"></div>');
            for (var i = 0; i < this._W.tr_attr.length; i++) {
                if (typeof _a.tr_attr[this._W.tr_attr[i]] !== 'undefined') {
                    line.attr(this._W.tr_attr[i], _a.tr_attr[this._W.tr_attr[i]]);
                }
            }

            for (var i = 0; i < this.fieldCount; i++) {
                var row = $('<span class="HW_table_row"></span>');
                row.text(_a.data[i]);
                for (var l = 0; l < this._W.td_attr.length; l++) {
                    if (typeof _a.td_attr[this._W.td_attr[l]] !== 'undefined') {
                        row.attr(this._W.td_attr[l], _a.td_attr[this._W.td_attr[l]]);
                    }
                }
                line.append(row);
            }
            this._showCtrlBut(line);
            this.lines.push(line);
            this.table.append(line);
            this.setOneLineWidth(line, _a.width);
        }
        //如果开启了初始化结束进行排序则排序
        if (_W.loadSort) {
            this._fieldClick(_W.sortField, this.getOneRow(0, _W.sortField));
        }
    }

    /**
     * 文件上传控件
     * _W:{}
     * _W.target:jq selector
     * _W.uploadText:string 上传按钮文字
     * _W.mult:Boolean 是否为多文件上传 默认为false
     * _W.accept:[] 允许上传的文件类型 ['png','jpg','jpeg']
     * _W.inputName:string 文件上传参数名 默认为HW_upload_input
     * _W.maxSize:int 允许上传的文件大小 单位为kb 默认为 4096
     * _W.fileCheck:function 检查文件是否允许上传 允许上传则返回true 不允许则返回错误提示
     * _W.viewSize:[] 设置图片预览框宽高 默认为400，300
     * _W.viewImageWidth:int 设置预览图片宽度 默认为80
     * _W.isImage:Boolean 设置支持图片上传 默认为true
     * _W.done:function 上传完成回调函数
     */
    HW.Widget.upload.Create = function(_W) {
        if (typeof _W === 'undefined' || typeof _W.target === 'undefined' || typeof _W.url === 'undefined' || $.trim(_W.url) == '')
            return null;
        this.upload = $(_W.target).eq(0);
        if (this.upload.length < 1)
            return;

        _W.uploadText = typeof _W.uploadText === 'undefined' ?
            ($.trim(this.upload.text()) == '' ? '请选择要上传的文件' : this.upload.text()) : _W.uploadText;
        _W.mult = typeof _W.mult !== 'boolean' ? false : _W.mult;
        _W.accept = typeof _W.accept === 'undefined' ? ['png', 'jpg', 'jpeg'] : _W.accept;
        _W.inputName = typeof _W.inputName === 'undefined' ? 'HW_upload_files' : _W.inputName;
        _W.FileReader = typeof FileReader === 'function' ? true : false;
        _W.FormData = typeof FormData === 'function' ? true : false;
        _W.maxSize = typeof _W.maxSize !== 'number' ? 4096 : _W.maxSize;
        _W.fileCheck = typeof _W.fileCheck !== 'function' ? null : _W.fileCheck;
        _W.viewSize = typeof _W.viewSize === 'undefined' ? [400, 300] : _W.viewSize;
        _W.viewImageWidth = typeof _W.viewImageWidth !== 'number' ? 80 : _W.viewImageWidth;
        _W.isImage = typeof _W.isImage !== 'boolean' ? true : _W.isImage;
        _W.timeout = typeof _W.timeout !== 'number' ? 20 : _W.timeout;
        _W.done = typeof _W.done !== 'function' ? HW.NULLF : _W.done;

        this._W = _W;

        /**
         * 设置允许上传的文件类型
         * accept:[]
         */
        this.setAccept = function(accept, input) {
            input = this.fileInput || input;

            if (typeof accept === 'undefined')
                accept = ['png', 'jpg', 'jpeg'];
            input.attr('accept','');
            for (var i = 0; i < accept.length; i++)
                accept[i] = '.' + accept[i];
            accept = accept.join(',');
            input.attr('accept', accept);
        }

        this._initUpload = function() {
            this.upload.html('');
            this.upload.append($('<span class="HW_upload_text">' + _W.uploadText + '</span>'));
            this.fileInput = $('<input class="HW_upload_form" type="file"/>');
            this.setAccept(_W.accept);
            this.fileInput.attr({
                multiple: _W.mult,
                id: _W.inputName,
                name: _W.inputName
            });
            if (_W.isImage) {
                this.viewImage = $('<div class="HW_upload_view"></div>');
                this.viewImage.css({
                    width: _W.viewSize[0],
                    'max-height': _W.viewSize[1]
                });
                this.upload.append(this.viewImage);
            }
            this.uploadFiles = [];
            this.fileInput.change(this.ActionFunction(this._fileChange));
        }

        this._readyUpload = function() {
            this.upload.children('span.HW_upload_text').remove();
            this.upload.append($('<div class="HW_start_but">开始上传</div>'));
            this.upload.append($('<div class="HW_change_but">重新选择</div>'));
        }

        this._fileCheck = function(file) {

            if (_W.fileCheck !== null)
                return _W.fileCheck(file);

            if (this._W.accept.join('').indexOf(file.type.split('/')[1]) < 0)
                return '不允许上传的文件类型';

            if (this._W.maxSize * 1024 < file.size)
                return '只允许上传小于' + this._W.maxSize + 'kb的文件';

            return true;
        }
        this.ActionFunction = function(fun) {
            var x = this;
            return function(event) {
                var target = $(event.target || event.srcElement);
                fun.call(x, event, target);
            }
        }
        this._fileChange = function(event, input) {
            this.uploadFiles = [];
            var checkResult = '';
            for (var i = 0; i < input[0].files.length; i++) {
                if ((checkResult = this._fileCheck(input[0].files[i])) !== true) {
                    break;
                }
                this.uploadFiles[i] = input[0].files[i];
            }
            if (checkResult !== true) {
                this.uploadFiles = [];
                HW.Pop.message.Create({
                    text: checkResult,
                    fun: (function(x) {
                        return function() {
                            x.openFileDialog();
                        }
                    })(this)
                });
                return checkResult;
            }
            this._readyUpload();
            this.loadViewImage(this.viewImage);
        }

        this.loadViewImage = _W.isImage ? function(viewTarget) {
            var viewTarget = typeof viewTarget === 'undefined' || viewTarget.length < 1 ? this.viewImage : viewTarget;

            if (_W.FileReader) {
                if (this.uploadFiles.length > 0)
                    viewTarget.html('');
                for (var i = 0; i < this.uploadFiles.length; i++) {
                    (function(file, viewImage) {
                        var reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = function() {
                            viewImage.append($('<img src="' + this.result + '" />'));
                        }
                    })(this.uploadFiles[i], viewTarget);
                }
            } else {
                viewTarget.html('当前版本的浏览器不支持实时预览哦');
            }
        } : HW.NULLF;


        this._initUpload();

        HW.Document.body.append(this.fileInput);

        //上传选中的文件
        this.send = function() {
            if (this.uploadFiles.length < 1) {
                HW.Pop.message.Create({
                    text: '请先选择要上传的文件',
                    butText: '选择',
                    fun: (function(x) {
                        return function() {
                            x.openFileDialog();
                            x._initUpload();
                        }
                    })(this)
                })
                return;
            }

            if (this._W.FormData) {
                var files = new FormData();
                for (var i = 0; i < this.uploadFiles.length; i++)
                    files.append(i, this.uploadFiles[i]);

                $.ajax({
                    url: this._W.url,
                    type: 'POST',
                    data: files,
                    contentType: false,
                    processData: false,
                    timeout: 1000 * 60 * this._W.timeout,
                    xhr: xhrOnProgress(function(e) {
                        HW.Pop.progress.Create(100 * (e.loaded / e.total))
                    })
                })
                    .done((function(x) {
                        return function(data) {
                            x._W.done(data);
                            xhrOnProgress.onprogress = null;
                        }
                    })(this))
                    .fail(function(data) {
                        HW.Pop.message.Create({
                            text: '上传失败,请稍后重试'
                        });
                    });


            } else {

                HW.Pop.message.Create({
                    text: '浏览器版本过低，无法上传'
                });
            }
        }

        //打开文件选择窗口
        this.openFileDialog = function() {
            this.fileInput.click();
        }

        this.upload.click(this.ActionFunction(function(event, target) {
            if (target.hasClass('HW_upload_text')) {
                this.fileInput.click();
            } else if (target.hasClass('HW_start_but')) {
                this.send();
            } else if (target.hasClass('HW_change_but')) {
                this._initUpload();
                this.openFileDialog();
            }
        }));
        var xhrOnProgress = function(fun) {

            xhrOnProgress.onprogress = fun; //绑定监听函数

            return function() {
                var xhr = $.ajaxSettings.xhr();

                if (xhrOnProgress.onprogress == null || typeof xhrOnProgress.onprogress === 'undefined')
                    return xhr;

                if (xhrOnProgress.onprogress && xhr.upload) {
                    xhr.upload.onprogress = xhrOnProgress.onprogress;
                }
                return xhr;
            }
        };

    }
    // 特效组件
    /**
     * 数字流组件
     * _E:{}
     * _E.target: jq selector
     * _E.width:int 宽度 默认铺满屏幕
     * _E.height:int 高度
     * _E.zIndex:int 层级 默认为0
     * _E.color:[] rgba
     * _E.backgorundColor:[] rgba
     * _E.fontSize:int 字体大小
     * _E.fontWeight:string 字体加粗 默认为 '' 不加粗
     * _E.fontStyle:string 字体样式
     * _E.full:Boolean 是否全屏
     * _E.step:int 数字移动间隔 默认为10
     * _E.count:int 最多拥有几个数字 默认根据长宽来计算数字密度
     * _E.density:int 密度 当不指定count时该选项用于配合计算应该拥有的数字个数
     * _E.densityWH:[] 密度计算
     * _E.fps:int 刷新频率
     * _E.lose:int 每次刷新随机消失的数字个数 默认为5
     * _E.text:[] 要输出的文字
     */
    HW.Effect.numberFlow = function(_E) {
        this.canvas = document.getElementById(_E.target)||$(_E.target)[0];
        if (this.canvas == null||typeof this.canvas==='undefined'||this.canvas.length<1)
            return;
        var cxt = this.context = this.canvas.getContext('2d');

        _E.zIndex = typeof _E.zIndex !== 'number' ? 0 : _E.zIndex;
        _E.width = typeof _E.width !== 'number' ? HW.View.screenWidth : _E.width;
        _E.height = typeof _E.height !== 'number' ? HW.View.screenHeight : _E.height;
        _E.color = !$.isArray(_E.color) ? [0, 160, 0, 1] : _E.color;
        _E.backgorundColor = !$.isArray(_E.backgorundColor) ? [0, 0, 0, 0.08] : _E.backgorundColor;
        _E.fontSize = typeof _E.fontSize !== 'number' ? 12 : _E.fontSize;
        _E.fontWeight = typeof _E.fontWeight !== 'string' ? '' : _E.fontWeight;
        _E.fontStyle = typeof _E.fontStyle !== 'string' ? 'Arial' : _E.fontStyle;
        _E.density = typeof _E.density !== 'number' ? 30 : _E.density;
        _E.densityWH = (!$.isArray(_E.densityWH) || _E.densityWH.length < 2) ? [200, 20] : _E.densityWH;
        _E.fps = typeof _E.fps !== 'number' ? 50 : _E.fps;
        _E.step = typeof _E.step !== 'number' ? 10 : _E.step;
        _E.lose = typeof _E.lose !== 'number' ? 5 : _E.lose;
        _E.full=typeof _E.full!=='boolean'?true:_E.full;
        _E.text=(typeof _E.text==='undefined'||!$.isArray(_E.text))?[]:_E.text;

        cxt.font = _E.fontWeight + ' ' + _E.fontSize + 'px ' + _E.fontStyle;

        this.color = {};

        this.canvas.width = _E.width;
        this.canvas.height = _E.height;

        this._E = _E;
        this.getDensity = function() {
            var area = this.canvas.width * this.canvas.height;
            var a = this._E.densityWH[0] * this._E.densityWH[1];
            return parseInt((area / a) * (this._E.density / 100));
        }

        _E.autoDensity = typeof _E.count !== 'number' ? true : false;
        _E.count = typeof _E.count !== 'number' ? this.getDensity() : _E.count;

        this._E = _E;


        this.setColor = function(color, opacity) {
            if (!$.isArray(color) || color.length < 3)
                return null;
            return this.color.color = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (typeof opacity !== 'number' ? (typeof color[3] !== 'undefined' ? color[3] : 1) : opacity) + ')';
        }
        this.setBackgroundColor = function(color, opacity) {
            if (!$.isArray(color) || color.length < 3)
                return null;
            return this.color.backgorundColor = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (typeof opacity !== 'number' ? (typeof color[3] !== 'undefined' ? color[3] : 1) : opacity) + ')';
        }
        this.setColor(_E.color);

        cxt.fillStyle = this.setBackgroundColor(_E.backgorundColor, 1);
        cxt.fillRect(0, 0, _E.width, _E.height);

        this.setBackgroundColor(_E.backgorundColor, 0.08);

        this.allText = [];
        this.getAText = function() {
            var text = {
                left: parseInt(Math.random() * this.canvas.width),
                top: parseInt(Math.random() * this.canvas.height)
            };
            //根据出生点判断向左还是向右移动 0向左 1向右
            text.r = text.left > this.canvas.width / 2 ? 0 : 1;
            return text;
        }
        this.init = function(count) {
            count = typeof count !== 'number' ? this._E.count : count;
            this.allText = [];
            for (var i = 0; i < count; i++) {
                this.allText[i] = this.getAText();
            }
        }
        this.init();

        function draw() {
            cxt.font = this._E.fontWeight + ' ' + this._E.fontSize + 'px ' + this._E.fontStyle;
            cxt.fillStyle = this.color.backgorundColor;
            cxt.fillRect(0, 0, this._E.width, this._E.height);
            cxt.fillStyle = this.color.color;
            for (var i = 0; i < this.allText.length; i++) {
                if(this._E.text.length<1)
                    cxt.fillText(parseInt(Math.random() * 10) >= 5 ? 1 : 0, this.allText[i].left, this.allText[i].top);
                else
                    cxt.fillText(this._E.text[parseInt(Math.random() * this._E.text.length)],this.allText[i].left, this.allText[i].top);
            }
        }

        function update() {
            for (var i = 0; i < this.allText.length; i++) {
                if (this.allText[i].left > this.canvas.width || this.allText[i].left < 0)
                    this.allText[i] = this.getAText();
                if (this.allText[i].r == 0)
                    this.allText[i].left -= this._E.step;
                else
                    this.allText[i].left += this._E.step;
            }

            for (var i = 0; i < this._E.lose;) {
                var l = parseInt(Math.random() * 100);
                if (l < this._E.count) {
                    this.allText[l] = this.getAText();
                    i++;
                }
            }
        }

        ifunction = function(draw, update, x) {
            return function() {
                draw.call(x);
                update.call(x);
            }
        }

        this.interval = setInterval(ifunction(draw, update, this), _E.fps);

        this.start = function(fps) {
            fps = typeof fps === 'number' ? fps : this._E.fps;
            this.interval = setInterval(ifunction(draw, update, this), fps);
        }
        this.stop = function() {
            clearInterval(this.interval);
        }

        this.setWidth_Height = function(width, height) {
            width = typeof width !== 'number' ? this._E.width:width;
            height = typeof height !== 'number' ? this._E.height:height;
            if (this._E.autoDensity) {
                clearTimeout(this.setWidth_Height.timeout);
                this.setWidth_Height.timeout=setTimeout((function(x){
                    return function(){
                        x._E.count = x.getDensity();
                        x.init();
                        x.canvas.width = width;
                        x.canvas.height = height;
                        cxt.fillStyle = x.setBackgroundColor(x._E.backgorundColor, 1);
                        cxt.fillRect(0, 0, x._E.width, x._E.height);
                        cxt.fillStyle = x.setBackgroundColor(x._E.backgorundColor, 0.08);
                    }
                })(this),200);
            }else{
                this.canvas.width = width;
                this.canvas.height = height;
                cxt.fillStyle = this.setBackgroundColor(this._E.backgorundColor, 1);
                cxt.fillRect(0, 0, this._E.width, this._E.height);
                cxt.fillStyle = this.setBackgroundColor(this._E.backgorundColor, 0.08);
            }
        }

        if (_E.full) {
            HW.View.AddResetSizeHandel((function(x) {
                return function() {
                    x._E.width = HW.View.screenWidth;
                    x._E.height = HW.View.screenHeight;
                    x.setWidth_Height();
                }
            })(this));
        }
    }
})();