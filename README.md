# Math Function Printer
---

### ** 没什么特别的就是一个简单的函数图像显示工具 **

** *注意 : 注释中d- 后面的内容为该参数的默认值 **

* ##### 导入模块 
	
		import FunctionPrinter from 'FunctionPrinter'	
		const FunctionPrinter = require('FunctionPrinter')
		
		// 或者....
		<script src="${projectUrl}/FunctionPrinter.js"></script>
	
* ##### (假设有以下这样的一个代码)
  ```html
			<body>
			<div id="parent" style="width:100%;height:100%;" >
				<canvas id="cvs" width="800" height="800"></canvas>
			</div>
			<script src="FunctionPrinter.js" type="text/javascript" charset="utf-8"></script>
			<script type="text/javascript">
				// 下面所说的代码都可在这儿编码并测试
			</script>
		</body>
	```


* ##### 基本用法
	1. #####初始化操作
	
		  new 就完事儿了。需要考虑的是FunctionPrinter构造函数中的两个参数分别是：
		1. ** cvs: canvas 元素节点 (type: HTMLCanvasElement)**
		2. ** options : 相关配置项 (type: Object)**
		
		```javascript
			// 像这样已经可以完成最基本的配置了
			const fcp = new FunctionPrinter(document.querySelector("#cvs"))		
		```

	2. ##### 绘制函数
	
		 绘制将会用到DrawFunction函数,DrawFunction需要以下参数:
	   1. **key: String | d- undefined 函数的唯一标识 (用函数名即可比如 y=kx+b)**
	   2. **fn: 一个计算Y轴值的回调，fn(x:Number) -> Number | d- undefined 当传入x值时经过fn函数的计算得到y值，即可获得由(x,y)组成的坐标**
	   3. **animate: String || Number | d- -1 是否开启动画展示和动画速度控制，当参数类型为Number时则数字越小速度越快。当改参数为String时则应是下列选项中的其中一个:**

			- quick 快速执行
			- middle 中速执行
			- slow 慢速执行
			- queue 队列执行,即在完成一个函数绘制后再绘制下一个函数
			- -1 为不启用动画
	   4. **color: String || CanvasGradient | d- black 绘制该函数时使用的颜色**
	   5. **pointColor: String || CanvasGradient | d- undefined 函数标点的点位颜色**
	   6. **lineWidth： Number | d- 1.5 绘制函数时线段的宽度**
	   7. **point_filter： Function | d- function(){return false;} 点位过滤器(后面介绍)**
	   8. **tip_callback: Function | d- null 点位提示检查器 (后面介绍)**
	   
	   	有了这个函数已经可以绘制一个简单的函数了，比如一次函数或者正比例函数
		```javascript
			// 接着上面初始化后的代码
			// 这样即可在页面上绘制一个y=2x+3的一个一次函数图像
			fcp.DrawFunction('y=2x+3',(x)=>{
				return 2 * x + 3
			})
		```
		
	3. ##### 拖拽事件
		
		现在已经有了一个简单的一次函数图像了，但是不能一直使用这种静态的方式观察，我更想知道所有x轴的值对应的坐标应该是什么样的，那么就需要拖动图像。这一步其实很简单

		```javascript
			// 接着上面的代码,只需要小改一下new FunctionPrinter中的参数即可
			const fcp = new FunctionPrinter(document.querySelector("#cvs"),{events:['draw']})
		```
		样就已经完成了拖动的实现。接下来我们可能会想调整一下刻度之间的距离(单位:px)和刻度之间的比例尺，让我们了解一下新的参数。

	4. ##### 轴的比例样式调整
		
		假设我现在需要调整轴的每一个刻度之间的距离，或者我不想显示1,2,3,4,5...这样的数列排列，甚至我想调整一下字的颜色或者字体以及字的大小,假设我现在想把x轴的标注线段变粗，刻度线段颜色改为红色	
			
		```javascript
			cons fcp = new FunctionPrinter(document.querySelector("#cvs"),{
					events:['draw'],
					mark: {
						x: { // 针对于x轴，如果是y轴则为y 参数保持一致
							line:{
								accuracy: 10, // 每一个刻度之间相隔的距离 (单位:px) d- 14
								lineWidth: 1.5, // 标注刻度的粗细 d- 1.5
								width: 10,    // 对于x轴来说即标注刻度线段的高度，对于y来说则为宽度 d- 10
								color: 'red'  // 标注刻度线段颜色 这个颜色可以是rgba或者十六进制颜色或者是canvas颜色渐变类 d- '#000000'
							},
							font:{ // 刻度字参数
								size: 14, // 字体大小 d- 14
								color: 'balck', // 字体颜色 d- '#000000'
								family: '微软雅黑', // 字体类别 d- '微软雅黑'
								weight: 1.5 // 字体粗细 d- 1.5
							}
							accuracy: 10
						}
					}
				})
		```

		由此就可以得到一个由10,20,30,40,50...数列组成的刻度线段颜色为红色的x轴样式了。如果想调整轴的样式就需要引入一个新的参数这个参数比较简单,来看一下示例

		```javascript
				cons fcp = new FunctionPrinter(document.querySelector("#cvs"),{
					axis:{ // 轴样式配置和mark参数一样，有x和y两个参数
						x:{ // x轴样式
							color: 'red', // 轴线段的颜色 d- '#000000'
							lineWidth: 3 // 轴线段的粗细 d- 1.5 
						},
						y:{ // y轴样式
							color: 'blue', // 轴线段的颜色 d- '#000000'
							lineWidth: 2 // 轴线段的粗细 d- 1.5 
						}									
					}
				})
		```

	5. ##### 缩放事件
		
		有的时候为了省事儿，可能会想将整个坐标轴缩小或放大观察的一个情况。涉及到局部和整体的切换。那么现在将要引入一个新的事件zoom。只需要在events中加入zoom事件，可是光有zoom事件还不够，缩放还需要有一个范围，每次缩放的步长都需要考虑，这样就需要一个参数(zoom)来控制

		 ```javascript
			cons fcp = new FunctionPrinter(document.querySelector("#cvs"),{
				events:['draw','zoom'], // 在events添加zoom事件
				mark: {
					x: { // 针对于x轴，如果是y轴则为y 参数保持一致
						line:{
							accuracy: 10, // 每一个刻度之间相隔的距离 (单位:px) d- 14
							lineWidth: 1.5, // 标注刻度的粗细 d- 1.5
							width: 10,    // 对于x轴来说即标注刻度线段的高度，对于y来说则为宽度 d- 10
							color: 'red'  // 标注刻度线段颜色 这个颜色可以是rgba或者十六进制颜色或者是canvas颜色渐变类 d- '#000000'
						},
						font:{ // 刻度字参数
							size: 14, // 字体大小 d- 14
							color: 'balck', // 字体颜色 d- '#000000'
							family: '微软雅黑', // 字体类别 d- '微软雅黑'
							weight: 1.5 // 字体粗细 d- 1.5
						}
						accuracy: 1 // 每隔一个单位距离，实际对应的轴增值
					}
				},
				zoom: {// 缩放控制参数
					max: 50, // 缩小程度最低值 d- 0
					min: 10, // 放大程度最大值 d- 0
					accuracy: 10 // 每次缩放增加或减少的步长
				}
			})
		 ```

	6. ##### 函数图像样式
		
		介绍了x轴和y轴样式调整的方案，接下来函数图像本身也需要一个自定义样式可以美化或者区分各函数
			
		```javascript
		//需要用到DrawFunction函数的第3个参数和第4个参数,前面已经说明了参数的使用方式那我将一笔带过
		fcp.DrawFunction('y=2x+3',(x)=>{
				return 2 * x + 3
		},-1,'red',null,3)
		```

	7. ##### 点位标注
	
		有些时候光有一个函数图像线段没有办法知道重要点的坐标为了能够相对明显的观察图像，可以对一些重要点的坐标进行筛选并显示。接下来将介绍点位显示。
			
		```javascript
		// 首先点位有自己的样式
		const fcp = new FunctionPrinter(document.querySelector("#cvs"),{
			events:['draw'],
			points: { // 点位样式
				size: 3, // 标注点位的大小 d- 5
				solid: false // 标注点是否为实心 d- false
			}
		})
			
		// 调用绘制函数时需要添加一个点位过滤器
		fcp.DrawFunction('y=2x+3',(x)=>{
				return 2 * x + 3
		},-1,'red',null,3, (x,y)=>{
			// 显示所有x轴为整数的点位
			if(Number.isInteger(x))
			{
				return true
			}
		})
		```
	
	8. ##### 悬浮窗事件

		可能有的钢筋(杠精)还是觉得不够明显不够直接，那只能悬浮窗查看函数的提示了。这种方式也属于事件类提示。但是这需要基于points配置的情况下(开启点未标注)

		```javascript
		const fcp = FunctionPrinter(document.querySelector("#cvs"),{
			events:['draw','showtip'], // 在events添加showtip事件
			points: { // 点位样式
				size: 3, // 标注点位的大小 d- 5
				solid: false // 标注点是否为实心 d- false
			}
				
		})
		```

		其实就这样已经可以了，但是有些人可能需要一些自定义的提示希望有一些自己的文字修改那么就需要用到DrawFunction的最后一个参数

		```javascript
		fcp.DrawFunction('y=2x+3',(x)=>{
				return 2 * x + 3
			},-1,'red',null,3, (x,y)=>{
				// 显示所有x轴为整数的点位
				if(Number.isInteger(x))
				{
					return true
				}
			},(key,color,x,y)=>{
				// key : 对应DrawFunction的第一个参数
				// color : 对应DrawFunction的第四个参数
				// x : x坐标值
				// y : y坐标值
				return {
							key:key + " : 一次函数",
							x:x,
							y:y,
							color:'orange'
					  }
		})
		```
	9. ##### 轴线标识

		既然已经有了悬浮窗提示但是可能不能够在图像上一目了然，接下来需要一个新的特性:轴线标识,能够更快的找到刻度对应点。
		
		* 注： 这个也是需要开启点位标注才能打开的功能**
		
	```javascript
		const fcp = new FunctionPrinter(document.querySelector("#cvs"),{
			events:['draw','zoom','showtip'],
			mark:{
				x: { // 针对于x轴，如果是y轴则为y 参数保持一致
					line:{
						accuracy: 30, // 每一个刻度之间相隔的距离 (单位:px)
						lineWidth: 1.5, // 标注刻度的粗细
						width: 10,    // 对于x轴来说即标注刻度线段的高度，对于y来说则为宽度
						color: 'black'  // 刻度颜色 这个颜色可以是rgba或者十六进制颜色或者是canvas颜	色渐变类
					},
					font:{
						size: 14,
						weight: 1.5
					},
					accuracy: 1
				}
			},
			zoom: {// 缩放控制参数
						max: 50, // 缩小程度最低值 d- 0
						min: 10, // 放大程度最大值 d- 0
						accuracy: 10 // 每次缩放增加或减少的步长
				},
			points: {
				size: 3,
				solid: 0
			},
			tipline: { // 轴线标识参数
				color: 'auto', // 线段颜色,可以指定颜色也可以选择auto自适应颜色 d- auto
				type: 'dotted', // 线段的种类。目前提供的有两种分别是 dotted：虚线 chain：点划线。也可以自定义配置见下文说明 d- [4,2]
				width: 3, // 线段粗细 d- 3
				animate: false// 是否开启动画 d- false
			},
				// syncEle: window
		})
	```

	 *更多线段种类 [参见canvas虚线样式](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/setLineDash "线段样式")*
	这样就更加显而易见了。当然也可以直接将animate开启动画使得图像更加生动~
	
	10. ##### 函数动画
	
		这种直接的图像呈现方式没有办法明白图像是如何经过点位的比如log函数，接下来我们来理解一下DrawFunction的动画参数基于上面的代码，添加一个快速动画显示的log函数
			
		```javascript
			// 除了quick以后第二部分提到的所有参数都可以试一试，当然针对于queue模式的话就不过多赘述了，执行顺序和DrawFunction调用顺序注册的函数顺序一致
			fcp.DrawFunction('y=log(x)',function(x){
					return Math.log(x)
			},'quick','blue',null,1.5,(x,y)=>{
				if(Number.isInteger(x))
				{
					return true
				}
			},(key,color,x,y)=>{
				return {key,x,y,color}
			})
	 	

#### 还有一些小细节

- **销毁**
	- **删除函数调用fcp.RemoveFunction，两个参数分别是key和keep_animate。key则是DrawFunction中注册的key。因为RemoveFunction会使得画面重绘，所以保留的函数会重新渲染因此，keep_animate可以让重绘的函数保持动画渲染，当然也可以不开启这个状态**
	- ** Destory函数将销毁所有的资源并解绑事件，清除画布**
- **移动端**
	1. **移动端保持了基本上所有的功能除了图像的缩放(未来可能支持)**
	2. **另外移动端的悬浮提示，轴刻度点击与函数图像拖动需要通过调用ChangeTouch进行切换。也就是说点击提示和拖动图像同时只能存在其中一个，默认是拖动图像**
	3. **关于自适应，在new FunctionPrinter中可以配置syncEle参数可以是window或者是一个元素节点当检测到目标元素大小发生改变将重绘图像，以保证自适应**
	
- ** 关于极坐标函数 ：**

	DrawFunction的第二个参数的返回值可以是一个Arrary，Arrary的第一个值是x轴，第二个是y轴。
		
	```javascript
			fcp.DrawFunction('极坐标',(x)=>{
			// 爱心函数
			if(x > -1 && x < Math.PI*2)
				return [16*Math.pow(Math.sin(x),3),13*Math.cos(x)-5*Math.cos(2*x)-2*Math.cos(3*x)-Math.cos(4*x)]
			},'quick','red',null,1)
	```

	这个时候你会发现可以是可以，但是画出来的线段有些顿，那是因为精度不够导致的问题。正好把最后遗漏的两个参数说明一下

	```javascript
	// 针对于上面的问题只需要添加一个参数即可
	const fcp = new FunctionPrinter(document.querySelector("#cvs"),{
		accuracy: 0.01, // 将精度调整为0.01(精度与图像质量程度成反比，与运算效率成正比) d- 0.1
		backgroundColor: '#ffffff' // String || CanvasGradient 背景颜色 d- #ffffff
		...
	})
	```
	
## ***实例代码***

```javascript
	
	const fcp = new FunctionPrinter(document.querySelector("#cvs"),{
		events:['draw','zoom','showtip'],
		mark:{
			x: { // 针对于x轴，如果是y轴则为y 参数保持一致
				line:{
					accuracy: 30, // 每一个刻度之间相隔的距离 (单位:px)
					lineWidth: 1.5, // 标注刻度的粗细
					width: 10,    // 对于x轴来说即标注刻度线段的高度，对于y来说则为宽度
					color: 'black'  // 刻度颜色 这个颜色可以是rgba或者十六进制颜色或者是canvas颜	色渐变类
					},
				font:{
					size: 14,
					weight: 1.5
				},
				accuracy: 1
			}
		},
		zoom: {// 缩放控制参数
			max: 50, // 缩小程度最低值 d- 0
			min: 10, // 放大程度最大值 d- 0
			accuracy: 10 // 每次缩放增加或减少的步长
		},
		points: {
			size: 3,
			solid: false
		},
		tipline: { // 轴线标识参数
			color: 'auto', // 线段颜色,可以指定颜色也可以选择auto自适应颜色 d- auto
			type: 'dotted', // 线段的种类。目前提供的有两种分别是 dotted：虚线 chain：点划线。也可以自定义配置见下文说明 d- [4,2]
			width: 3, // 线段粗细 d- 3
			animate: true// 是否开启动画 d- false
		},
		accuracy:0.1
	})

	fcp.DrawFunction('y=2x+3',(x)=>{
				return 2 * x + 2
			},-1,'red',null,1.5,(x,y)=>{
				// console.log(x)
				if(Number.isInteger(x))
				{
					return true
				}
			},(key,color,x,y)=>{
				return {key:key,x,y,color}
	})
	fcp.DrawFunction('y=-2x^2+3x+10',(x)=>{
				return -2 * x * x + 3 *x + 10
			},'middle','orange',null,1.5,(x,y)=>{
				if(Number.isInteger(x))
				{
					return true
				}
			},(key,color,x,y)=>{
				return {key:key,x,y,color}
	})

	fcp.DrawFunction('y=log(x)',function(x){
				return Math.log(x)
			},'queue','blue',null,1.5,(x,y)=>{
				if(Number.isInteger(x))
				{
					return true
				}
			},(key,color,x,y)=>{
					return {key,x,y,color}
	})
	
```

 # END

 ``` 
	国内github访问较慢，可能发送消息不能及时看到。如果有任何问题，可以发送邮箱: sdfsdvdac@qq.com
 ```
