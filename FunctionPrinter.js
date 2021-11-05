(function(global, factory){
	 typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	  typeof define === 'function' && define.amd ? define(factory) :
	  (global.FunctionPrinter = factory());
})(this,function(){
	
	function add_safe(arg1, arg2) {
	    var r1, r2, m;
	    try{r1=arg1.toString().split(".")[1].length;}catch(e){r1=0;}
	    try{r2=arg2.toString().split(".")[1].length;}catch(e){r2=0;}
	    m = Math.pow(10, Math.max(r1, r2));
	    return (arg1 * m + arg2 * m) / m;
	}
	
	FunctionPrinter.prototype.SetBackground = function(){
		this.__ctx.fillStyle = this.__cvs_backgound_color
		this.__ctx.fillRect(0,0,this.__cvs_wdt,this.__cvs_hgt)
	}
	
	FunctionPrinter.prototype.DrawAxis = function(){
		// [y上,y下,x前,x后]
		[[this.__start_point[0],0,this.__cvs_axis_opts.y.color,this.__cvs_axis_opts.y.width],[this.__start_point[0],this.__cvs_hgt,this.__cvs_axis_opts.y.color,this.__cvs_axis_opts.y.width],
		[0,this.__start_point[1],this.__cvs_axis_opts.x.color,this.__cvs_axis_opts.x.width],[this.__cvs_wdt,this.__start_point[1],this.__cvs_axis_opts.x.color,this.__cvs_axis_opts.x.width]].forEach((pos)=>{
			this.__ctx.beginPath();
			this.__ctx.strokeStyle = pos[2]
			this.__ctx.lineWidth = pos[3]
			this.__ctx.moveTo(this.__start_point[0],this.__start_point[1])
			this.__ctx.lineTo(pos[0],pos[1])
			this.__ctx.stroke()
			this.__ctx.closePath();
		})
	}
	
	FunctionPrinter.prototype.DrawMark = function(posX,posY,offset_x_line,offset_y_line){
		const options = this.__cvs_mark_opts,accuracyX = options.x.accuracy,accuracyY = options.y.accuracy
		this.__ctx.font = `${options.y.font.size}px ${options.y.font.family}`
		this.__ctx.lineWidth = options.y.line.lineWidth
		this.__ctx.textBaseline = 'middle'
		this.__ctx.textBaseline = 'center'
		// 渲染y轴上半部分
		for(let i = posY > 0 ? this.__start_point_values[1] - 1 * accuracyY : this.__start_point_values[1],top = (this.__ctx.beginPath(),this.__start_point[1]);top > 0;)
		{
			i += options.y.accuracy
			this.__maximum_point.y[0] = i
			top = this.__start_point[1] - Math.abs((i - this.__start_point_values[1]) / accuracyY * options.y.line.accuracy) + posY
			this.__ctx.strokeStyle = options.y.line.color
			this.__ctx.lineWidth = options.y.line.lineWidth
			this.__ctx.moveTo(this.__start_point[0] + (offset_y_line > 0 ? 1 : -1),top)
			this.__ctx.lineTo(this.__start_point[0] + offset_y_line,top)
			this.__ctx.stroke()
			this.__ctx.strokeStyle = options.y.font.color
			this.__ctx.lineWidth = options.y.font.weight
			this.__ctx.strokeText(i,this.__start_point[0] + offset_y_line + (offset_y_line > 0 ? 5 : this.__ctx.measureText(i).width * -1 - 5),top)
		}
		
		// 渲染y轴下半部分
		for(let i = posY < 0 ? this.__start_point_values[1] + 1 * accuracyY : this.__start_point_values[1],top = this.__start_point[1];top < this.__cvs_hgt;)
		{
			i -= options.y.accuracy
			this.__maximum_point.y[1] = i
			top = this.__start_point[1] + Math.abs((i - this.__start_point_values[1]) / accuracyY * options.y.line.accuracy) + posY
			this.__ctx.strokeStyle = options.y.line.color
			this.__ctx.lineWidth = options.y.line.lineWidth
			this.__ctx.moveTo(this.__start_point[0] + (offset_y_line > 0 ? 1 : -1),top)
			this.__ctx.lineTo(this.__start_point[0] + offset_y_line,top)
			this.__ctx.stroke()
			this.__ctx.strokeStyle = options.y.font.color
			this.__ctx.lineWidth = options.y.font.weight
			this.__ctx.strokeText(i,this.__start_point[0] + offset_y_line + (offset_y_line > 0 ? 5 : this.__ctx.measureText(i).width * -1 - 5),top)
		}
		this.__ctx.closePath()
		this.__ctx.font = `${options.x.font.size}px ${options.x.font.family}`
		// 渲染x轴前半部分
		for(let i = posX > 0 ? this.__start_point_values[0] + 1 * accuracyX : this.__start_point_values[0],left = (this.__ctx.beginPath(),this.__start_point[1]);left > 0;)
		{
			i -= options.x.accuracy
			this.__maximum_point.x[1] = i
			left = this.__start_point[0] - Math.abs((i - this.__start_point_values[0]) / accuracyX * options.x.line.accuracy) + posX
			this.__ctx.strokeStyle = options.x.line.color
			this.__ctx.lineWidth = options.x.line.lineWidth
			this.__ctx.moveTo(left,this.__start_point[1] + (offset_x_line > 0 ? 1 : -1))
			this.__ctx.lineTo(left,this.__start_point[1] - offset_x_line)
			this.__ctx.stroke()
			this.__ctx.strokeStyle = options.x.font.color
			this.__ctx.lineWidth = options.x.font.weight
			this.__ctx.strokeText(i,left - this.__ctx.measureText(i).width / 2,this.__start_point[1] - offset_x_line + (offset_x_line > 0? -10 : 10))
		}
		// 渲染x轴后半部分
		for(let i = posX < 0 ? this.__start_point_values[0] - 1 * accuracyX : this.__start_point_values[0],left = this.__start_point[0];left < this.__cvs_wdt;)
		{
			i += options.x.accuracy
			this.__maximum_point.x[0] = i
			left = this.__start_point[0] + Math.abs((i - this.__start_point_values[0]) / accuracyX * options.x.line.accuracy) + posX
			this.__ctx.strokeStyle = options.x.line.color
			this.__ctx.lineWidth = options.x.line.lineWidth
			this.__ctx.moveTo(left,this.__start_point[1] + (offset_x_line > 0 ? 1 : -1))
			this.__ctx.lineTo(left,this.__start_point[1] - offset_x_line)
			this.__ctx.stroke()
			this.__ctx.strokeStyle = options.x.font.color
			this.__ctx.lineWidth = options.x.font.weight
			this.__ctx.strokeText(i,left - this.__ctx.measureText(i).width / 2,this.__start_point[1] - offset_x_line + (offset_x_line > 0? -10 : 10))
		}
		this.__ctx.closePath()
		// 渲染原点
		this.__ctx.strokeText('O',this.__start_point[0] + (posX >= 0 ? -15 : 15),this.__start_point[1] + (posY <= 0 ? 15 : -15))
	}
	
	FunctionPrinter.prototype.ParseParams = function(options){
		options = options || {}
		let axis = options.axis || {},mark = options.mark || {},zoom = options.zoom || {},events = options.events || [],points = options.points || null,line = options.tipline || null;
		mark.x = mark.x || {}
		mark.y = mark.y || {}
		axis.x = axis.x || {}
		axis.y = axis.y || {}
		mark.x.line = mark.x.line || {}
		mark.y.line = mark.y.line || {}
		mark.x.font = mark.x.font || {}
		mark.y.font = mark.y.font || {}
		this.__cvs_accuracy = options.accuracy || 0.1
		this.__cvs_backgound_color = options.backgroundColor || '#ffffff'
		this.__cvs_axis_opts = {x:{color:axis.x.color || '#000000',width:axis.x.lineWidth || 1.5},y:{color:axis.y.color || '#000000',width:axis.y.lineWidth || 1.5}}
		this.__cvs_mark_opts = {x:{line:{accuracy:mark.x.line.accuracy || 30,lineWidth:mark.x.line.lineWidth || 1.5,width: mark.x.line.width || 10,color:mark.x.line.color || '#000000'},font:{size:mark.x.font.size || 14,color:mark.x.font.color || '#000000',family:mark.x.font.family || '微软雅黑',weight: mark.x.font.weight || 1.5},accuracy:mark.x.accuracy || 1},
								y:{line:{accuracy:mark.y.line.accuracy || 30,lineWidth:mark.y.line.lineWidth || 1.5,width: mark.y.line.width || 10,color:mark.y.line.color || '#000000'},font:{size:mark.y.font.size || 14,color:mark.y.font.color || '#000000',family:mark.y.font.family || '微软雅黑', weight: mark.y.font.weight || 1.5},accuracy:mark.y.accuracy || 1}}
		this.__zoom_opts = {max:zoom.max || 0,min:zoom.min || 0,accuracy:zoom.accuracy || 0}
		this.__events_opts = events
		if(points)
			this.__point_opts = {size:points.size > 0 ? points.size : 5,solid:Boolean(points.solid)}
		if(line)
		{
			this.__line_opts = {color:line.color || 'auto','width':line.width || 3,'animate':line.animate || false,'type':line.type || [4,2]}
			switch (this.__line_opts.type){
				case 'chain':
					this.__line_opts.type = [15, 3, 3, 3]
					break;
				case 'dotted':
					this.__line_opts.type = [10, 10]
					break
			}
		}
		this.__sync_ele = options.syncEle
	}
	
	FunctionPrinter.prototype.AnimationDraw = function(lists,key,start){
		lists = this.GetAnimationList(key,lists,start)
		if(lists.findIndex(item=>!item.reline) === -1)
			return
		Array.prototype.push.apply(this.__animate_queue,lists.slice(1))
		this.__animate_queue = this.__animate_queue.sort(function(_,$){return _.time - $.time})
		this.CreateTimer(key)
	}
	
	FunctionPrinter.prototype.GetAnimationList = function(key,lists,start){
		let speed = this.__function_list[key].animate
		outer:for(let i = 1;i < lists.length;i++)
		{
			if(lists[i].reline)
			{
				let start_idx = i
				while((++start_idx) < lists.length)
				{
					if(!lists[start_idx])
						break outer 
					else if(lists[start_idx].reline)
						continue
					lists[start_idx + 1].prev = {x:lists[start_idx].pos.x,y:lists[start_idx].pos.y}
					lists[start_idx + 1].color = this.__function_list[key].color
					lists[start_idx + 1].lineWidth = this.__function_list[key].lineWidth
					lists[start_idx + 1].time = this.__cache_time + (start * speed) + speed * i
					lists.splice(i,start_idx - i + 1)
					start_idx = 0
					break
				}
				if(start_idx > 0)
					lists.splice(i,start_idx - i + 1)
				continue
			}
			lists[i].prev = {x:lists[i - 1].pos.x,y:lists[i - 1].pos.y}
			lists[i].color = this.__function_list[key].color
			lists[i].lineWidth = this.__function_list[key].lineWidth
			lists[i].time = this.__cache_time + (start * speed) + speed * i
		}
		return lists
	}
	
	FunctionPrinter.prototype.FastDraw = function(key){
		let list = [],id = null,_self=this,color=_self.__function_list[key].color,lineWidth = _self.__function_list[key].lineWidth,speed = _self.__function_list[key].animate,cache_time = 0
		Array.prototype.push.apply(list,this.__fn_points_list[key])
		list = this.GetAnimationList(key,list,0)
		this.__ctx.moveTo(list[0].pos.x,list[0].pos.y)
		list.shift()
		if(list.findIndex(item=>!item.reline) === -1)
			return
		function fast_draw(time)
		{
			if(time >= cache_time && _self.__update_animate_flag)
			{
				let item = list.shift()
				_self.__ctx.beginPath()
				_self.__ctx.strokeStyle = item.color
				_self.__ctx.lineWidth = item.lineWidth
				_self.__ctx.moveTo(item.prev.x,item.prev.y)
				_self.__ctx.lineTo(item.pos.x,item.pos.y);
				_self.__ctx.closePath()
				_self.__ctx.stroke()
				cache_time = time + speed
			}
			if(list.length > 0 && _self.__update_animate_flag)
				window.requestAnimationFrame(fast_draw)
			else
			{
				_self.__ctx.lineCap = 'butt'
				_self.DrawPoint(key)
				window.cancelAnimationFrame(id)
			}	
		}
		id = window.requestAnimationFrame(fast_draw)
		this.__timers.push(id)
	}
	
	FunctionPrinter.prototype.BeginDraw = function(key,start,end,lastDraw,openAnimate){
		let list = this.__fn_points_list[key],animation = this.__function_list[key].animate
		if(list.length === 0)
			return
		if(animation > -1 && openAnimate)
		{
			if(lastDraw && animation === 0)
			{
				this.AnimationDraw(list.slice(start,end),key,start)
			}else{
				this.FastDraw(key)
			}
		}else{
			this.__ctx.strokeStyle = this.__function_list[key].color
			this.__ctx.lineWidth = this.__function_list[key].lineWidth
			this.__ctx.lineCap = 'round'
			this.__ctx.beginPath()
			this.__ctx.moveTo(list[start].pos.x,list[start].pos.y)
			list.slice(start + 1,end).forEach((item,index)=>{
				if(item.reline)
				{
					while((++index) < list.length)
					{
						if(!list[index])
							break
						else if(list[index].reline)
							continue
						this.__ctx.moveTo(list[index].pos.x,list[index].pos.y)
						break
					}
					return
				}
				this.__ctx.lineTo(item.pos.x,item.pos.y)
			})
			this.__ctx.stroke()
			this.__ctx.closePath()
			this.__ctx.lineCap = 'butt'
			this.DrawPoint(key)
		}
	}
	
	FunctionPrinter.prototype.RePrint = function(draw_static){
		draw_static = draw_static || false
		let maxY = this.__maximum_point.y[0],minY = this.__maximum_point.y[1],accuracyX = this.__cvs_mark_opts.x.line.accuracy,accuracyY = this.__cvs_mark_opts.y.line.accuracy,accuracy_x = this.__cvs_mark_opts.x.accuracy,accuracy_y = this.__cvs_mark_opts.y.accuracy
		for(let key in this.__function_list)
		{
			if(this.__function_list[key].animate != -1 && draw_static)
				continue
			let start = 0,near_length = 6000,fn = this.__function_list[key].fn,pft = this.__function_list[key].pft
			this.__fn_points_list[key] = []
			for(let i = this.__maximum_point.x[1]; i < this.__maximum_point.x[0];i = add_safe(i,this.__cvs_accuracy),start++)
			{
				let reline = false,x_value = i
				y_value = fn(x_value)
				// value > accuracy_y + this.__maximum_point.y[0] ||
				if(y_value && y_value.__proto__.constructor.name === "Array")
				{
					x_value = y_value[0]
					y_value = y_value[1]
				}
				if(Number.isNaN(y_value) || Number.isNaN(x_value) || typeof(y_value) !== 'number')
					continue
				switch (true){
					case (y_value===true):
					case (y_value > accuracy_y + this.__maximum_point.y[0]):
					case (y_value < this.__maximum_point.y[1] - accuracy_y):
						reline = true
						break;
				}
				this.__fn_points_list[key].push({value:{x:x_value,y:y_value},pos:{x:this.__start_point[0] + (x_value - this.__start_point_values[0]) / accuracy_x * accuracyX + this.__offset_pos.x,y:this.__start_point[1] - (y_value - this.__start_point_values[1]) / accuracy_y * accuracyY + this.__offset_pos.y},reline:reline,scale:false,radius:pft(x_value,y_value) && this.__point_opts ? this.__point_opts.size : 0})
				if(start === near_length && this.__function_list[key].animate)
				{
					this.BeginDraw(key,start - 6000,start,false,true)
					near_length += 6000
				}
			}
			this.BeginDraw(key,start > 6000 ? start - 6000 : 0,this.__fn_points_list[key].length,true,true)
		}
	}
	
	FunctionPrinter.prototype.DrawPoint = function(key){
		if(!this.__point_opts || !this.__update_animate_flag)
			return
		let points = this.__fn_points_list[key],self=this,color = self.__ctx.strokeStyle
		points.forEach((item)=>{
			if(item.reline && item.radius > 0)
				return
			self.__ctx.beginPath()
			self.__ctx.strokeStyle = self.__point_opts.solid ? 'transparent' : self.__function_list[key].color
			self.__ctx.arc(item.pos.x,item.pos.y,item.radius,0,Math.PI * 2,true)
			if(self.__point_opts.solid)
				self.__ctx.fillStyle = self.__function_list[key].pointColor || self.__function_list[key].color
			else
				self.__ctx.fillStyle = self.__function_list[key].pointColor || '#ffffff'
			self.__ctx.fill()
			self.__ctx.stroke()
			self.__ctx.closePath()
		})
	}
	
	FunctionPrinter.prototype.TimerAnimate = function(){
		let _self = this,lastTime = 0
		function task_reslove(time){
			_self.__cache_time = time
			if(_self.__update_animate_flag)
			{
				let item = _self.__animate_queue.shift()
				_self.__ctx.beginPath()
				_self.__ctx.strokeStyle = item.color
				_self.__ctx.lineWidth = item.lineWidth
				_self.__ctx.moveTo(item.prev.x,item.prev.y)
				_self.__ctx.lineTo(item.pos.x,item.pos.y);
				_self.__ctx.closePath()
				_self.__ctx.stroke()
			}
			if(_self.__animate_queue.length > 0 && _self.__update_animate_flag)
				window.requestAnimationFrame(task_reslove)
			else
			{
				window.cancelAnimationFrame(_self.__animate_id)
				_self.__key_queue.forEach(function(item){
					_self.DrawPoint(item)
				})
				_self.__key_queue.splice(0,_self.__key_queue.length)
				_self.__animate_queue.splice(0,_self.__animate_queue.length)
				_self.__animate_id = null
			}
		}
		return task_reslove
	}
	
	FunctionPrinter.prototype.CreateTimer = function(key){
		if(this.__key_queue.indexOf(key) === -1)
			this.__key_queue.push(key)
		if(this.__animate_id)
			return
		else
		{
			this.__animate_id = window.requestAnimationFrame(this.TimerAnimate())
			this.__timers.push(this.__animate_id)
		}
	}
	
	FunctionPrinter.prototype.DrawFunction = function(key,fn,animate,color,pointColor,lineWidth,point_filter,tip_callback){
		color = color || 'black'
		lineWidth = lineWidth || 1.5
		point_filter = point_filter && typeof(point_filter) === "function" ? point_filter : function(){return false}
		tip_callback = tip_callback && typeof(point_filter) === "function" ? tip_callback : null
		switch(animate)
		{
			case 'quick':
				animate = 0.1
				break
			case 'middle':
				animate = 20
				break
			case 'slow':
				animate = 30
				break
			case 'queue':
				animate = 0
				break
			case undefined:
				animate = -1
				break
		}
		this.__function_list[key] = {color:color,lineWidth:lineWidth,fn:fn,animate:animate,pft:point_filter,tck:tip_callback,pointColor}
		this.RePrint()
	}
	
	FunctionPrinter.prototype.RemoveFunction = function(key,keep_animate){
		if(this.__function_list[key])
		{
			this.__update_animate_flag = false
			this.__timers.forEach((id)=>window.cancelAnimationFrame(id))
			this.__timers.splice(0,this.__timers.length)
			delete this.__function_list[key]
			delete this.__fn_points_list[key]
			this.Clear()
			this.SetBackground()
			this.DrawAxis()
			this.DrawMark(posX,posY,pos_x_line,pos_y_line)
			setTimeout(()=>{
				this.__update_animate_flag = true
				for(let key in this.__fn_points_list)
					this.BeginDraw(key,0,this.__fn_points_list[key].length,true,keep_animate)
			},300)
		}
	}
	
	FunctionPrinter.prototype.Clear = function(){
		this.__ctx.clearRect(0,0,this.__cvs_wdt,this.__cvs_hgt)
	}
	
	FunctionPrinter.prototype.BindEvent = function(){
		const self = this
		let catch_flag = false,cache_position = {x:0,y:0},start_pos = [self.__start_point[0],self.__start_point[1]]
		ylineWidth = this.__cvs_axis_opts.y.width,xlineWidth = this.__cvs_axis_opts.x.width,
		x_accuracy = self.__cvs_mark_opts.x.line.accuracy,y_accuracy = self.__cvs_mark_opts.y.line.accuracy,
		xAccuracy = self.__cvs_mark_opts.x.accuracy,yAccuracy = self.__cvs_mark_opts.y.accuracy,
		x_line_width = this.__cvs_mark_opts.x.line.width,y_line_width = this.__cvs_mark_opts.y.line.width,
		posX = 0,posY = 0,pos_x_line = x_line_width,pos_y_line = y_line_width,
		timer = null,zoom_accuracy = this.__zoom_opts.accuracy,max_zoom = this.__zoom_opts.max,min_zoom = this.__zoom_opts.min,select_point = {},
		showTip = this.__events_opts.indexOf('showtip') > -1,radius = self.__point_opts ? self.__point_opts.size : 0,child_element = null
		if(showTip)
		{
			const parentElement = this.__cvs.parentElement
			parentElement.style.position = 'relative'
			child_element = document.createElement('div')
			child_element.setAttribute('style',`background:rgba(0,0,0,0.7);border-radius: 5px;box-sizing: border-box;padding: 10px;display: flex;overflow: hidden;position: absolute;visibility: hidden;transition: opacity 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s, visibility 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s, transform 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s;pointer-events: none;font: 14px / 21px "Microsoft YaHei";z-index: 9999999;    white-space: nowrap; transform:translate3d(0px, 0px, 0px);`)
			parentElement.appendChild(child_element)
		}
		function down(e){
			e.preventDefault()
			self.__update_animate_flag = false
			self.__timers.forEach(item=>window.cancelAnimationFrame(item))
			self.__timers.splice(0,self.__timers.length)
			cache_position.x = self.__event_type ? e.changedTouches[0].pageX : e.offsetX
			cache_position.y = self.__event_type ? e.changedTouches[0].pageY : e.offsetY
			catch_flag = true
		}
		
		function move(e){
			e.preventDefault()
			if(catch_flag)
			{
				let x = self.__event_type ? e.changedTouches[0].pageX - self.__cvs.offsetLeft : e.offsetX,y = self.__event_type ? e.changedTouches[0].pageY - self.__cvs.offsetTop : e.offsetY,offsetX = 0,offsetY = 0
				self.__offset_move.x += x-cache_position.x
				self.__offset_move.y += y-cache_position.y
				offsetX = start_pos[0] + self.__offset_move.x
				offsetY = start_pos[1] + self.__offset_move.y
				
				if(offsetX > self.__cvs_wdt)
				{
					self.__start_point[0] = self.__cvs_wdt - xlineWidth
					posX = (offsetX - self.__cvs_wdt) % x_accuracy
					self.__start_point_values[0] = parseInt((offsetX - self.__cvs_wdt) / x_accuracy) * xAccuracy * -1
				}else if(offsetX < 0)
				{
					self.__start_point[0] = xlineWidth
					posX = offsetX % x_accuracy
					self.__start_point_values[0] = parseInt(offsetX / x_accuracy) * xAccuracy * -1
				}else{
					self.__start_point[0] = offsetX
					posX = 0
				}
				
				if(offsetY > self.__cvs_hgt)
				{
					self.__start_point[1] = self.__cvs_hgt - ylineWidth
					posY = (offsetY - self.__cvs_hgt) % y_accuracy
					self.__start_point_values[1] = parseInt((offsetY - self.__cvs_hgt) / y_accuracy) * yAccuracy
				}else if(offsetY < 0)
				{
					self.__start_point[1] = ylineWidth
					posY = offsetY % y_accuracy
					self.__start_point_values[1] = parseInt(offsetY / y_accuracy) * yAccuracy
				}else{
					self.__start_point[1] = offsetY
					posY = 0
				}
				
				if(offsetX > self.__cvs_wdt - x_line_width)
					pos_y_line = -y_line_width
				else
					pos_y_line = y_line_width
				
				if(offsetY < y_line_width)
					pos_x_line = -x_line_width
				else
					pos_x_line = x_line_width
					
				self.Clear()
				self.SetBackground()
				self.DrawAxis()
				self.DrawMark(posX,posY,pos_x_line,pos_y_line)
				self.RePrint(true)	
				
				self.__offset_pos.x = posX
				self.__offset_pos.y = posY
				
				cache_position.x = x
				cache_position.y = y
			}else if(self.__point_opts){
				for(let key in self.__fn_points_list)
				{
					let index = self.__fn_points_list[key].findIndex(function(item){
						if(e.offsetX <= item.pos.x + radius + 5 && e.offsetX >= item.pos.x - radius - 5 && e.offsetY <= item.pos.y + radius + 5 && e.offsetY >= item.pos.y - radius - 5 && typeof(item.value.x) === "number" && item.radius > 0)
						{
							return true
						}
						return false
					})
					if(index > -1)
					{
						self.__update_animate_flag = false
						if(select_point.key === key && select_point.index === index)
							return
						select_point.radius = radius
						select_point.scale = false
						select_point = self.__fn_points_list[key][index]
						select_point.key = key
						select_point.index = index
						select_point.scale = true
						if(showTip)
						{
							let color = self.__function_list[key].color,x = select_point.value.x,y = select_point.value.y
							if(self.__function_list[key].tck)
							{
								const result = self.__function_list[key].tck(key,color,x,y)
								color = result.color || color
								key = result.key || key
								x = result.x || x
								y = result.y || y
							}
							child_element.innerHTML = `
								<div style="width: 15px;heidivght: 100%;">
									<div style="width: 100%;height: 15px;border-radius: 50%;background-color: ${color};"></div>
								</div>
								<div style="width: calc(100% - 15px);box-sizing: border-box;padding-left:10px;padding-right: 10px;color: #ffffff;overflow: hidden;">
									<div style="vertical-align: middle;line-height: 1;margin-bottom: 10px;word-break: break-all;">
										${key}
									</div>
									<div style="vertical-align: middle;line-height: 1;margin-bottom: 10px;word-break: break-all;">
										x = ${x}
									</div>
									<div style="vertical-align: middle;line-height: 1;word-break: break-all;">
										y = ${y}
									</div>
								</div>
							`
							child_element.style.visibility = 'visible'
							child_element.style.opacity = 1
							let $x = e.offsetX + 10,$y = self.__cvs_hgt - e.offsetY - 20
							if($x + child_element.offsetWidth > self.__cvs_wdt)
							{
								$x = e.offsetX - child_element.offsetWidth - 15
							}
							
							if(e.offsetY + child_element.offsetHeight + 20 > self.__cvs_hgt)
							{
								$y = self.__cvs_hgt - Math.abs(e.offsetY - child_element.offsetHeight - 15)
							}
							child_element.style.transform = `translate3d(${$x}px, -${$y}px, 0px)`
						}
						if(self.__line_opts)
						{
							DrawLine(select_point)()
							return
						}
						self.__timers.push(window.requestAnimationFrame(ScalePoint(select_point,radius + radius * 0.5,3000)))
						return
					}
				}
				if(select_point.scale)
				{
					select_point.scale = false
					select_point.radius = radius
					window.requestAnimationFrame(ScalePoint(select_point,5,1000))
				}
				select_point = {scale:false,radius:radius,value:{}}
				select_point.key = select_point.index = null
				if(showTip)
				{
					child_element.style.opacity = 0
					child_element.style.visibility = 'hidden'
				}
			}
		}
		
		function DrawLine(point)
		{
			let timer = null,most_offset = self.__line_opts.type.reduce((a,b)=>{return a * b}),offset = 0,color = self.__line_opts.color === 'auto' ? self.__function_list[point.key].color : self.__line_opts.color,fn = self.__line_opts.animate ? _DrawLine : new Function()
			function _DrawLine()
			{
				if(select_point.scale && select_point.value.x === point.value.x && select_point.value.y === point.value.y && self.__start_point[0] !== point.pos.x && self.__start_point[1] !== point.pos.y)
				{
					if(self.__line_opts.animate)
						ScalePoint(select_point,radius + radius * 0.5,3000)()
					else
						ScalePoint(select_point,radius + radius * 0.5,1000)()
					self.__ctx.setLineDash(self.__line_opts.type)
					self.__ctx.lineDashOffset = offset
					self.__ctx.lineWidth = self.__line_opts.width
					self.__ctx.beginPath()
					self.__ctx.strokeStyle = color
					self.__ctx.moveTo(point.pos.x,self.__start_point[1])
					self.__ctx.lineTo(point.pos.x,point.pos.y + (point.pos.y - self.__start_point[1] > 0 ? - radius * 2 - 2 : radius * 2 + 2))
					self.__ctx.moveTo(self.__start_point[0],point.pos.y)
					self.__ctx.lineTo(point.pos.x + (point.pos.x - self.__start_point[0] > 0 ? - radius * 2 - 2 : radius * 2 + 2),point.pos.y)
					self.__ctx.stroke()
					self.__ctx.closePath()
					self.__ctx.setLineDash([])
					offset++
					if(offset > most_offset)
						offset = 0
					timer = setTimeout(fn,10)
				}else{
					clearTimeout(timer)
				}
			}
			return _DrawLine
		}
		
		function ScalePoint(point,distance,_time){
			let timer = null,start_time = Date.now(),target = distance + select_point.radius
			
			function easeOut(t,b,c,d){return -c *(t/=d)*(t-2) + b}
			
			function _ScalePoint(time,_a)
			{
				self.__update_animate_flag = true
				self.Clear()
				self.SetBackground()
				self.DrawAxis()
				self.DrawMark(posX,posY,pos_x_line,pos_y_line)
				for(let key in self.__fn_points_list)
					self.BeginDraw(key,0,self.__fn_points_list.length,true,false)
				if(select_point.radius < distance && select_point.scale)
				{
					select_point.radius = easeOut(Date.now() - start_time,select_point.radius,target,_time)
					timer = window.requestAnimationFrame(_ScalePoint)
				}
				else
				{
					window.cancelAnimationFrame(timer)
				}
			}
			return _ScalePoint
		}
		
		function up(e){
			e.preventDefault()
			catch_flag = false
			self.__update_animate_flag = true
			self.Clear()
			self.SetBackground()
			self.DrawAxis()
			self.DrawMark(posX,posY,pos_x_line,pos_y_line)
			self.RePrint()	
		}
		
		function wheel(e){
			e.preventDefault()
			repeat_wheel_flag = true
			if(e.wheelDelta / 120 > 0)
			{
				// 放大
				self.__cvs_mark_opts.x.line.accuracy += zoom_accuracy
				self.__cvs_mark_opts.y.line.accuracy += zoom_accuracy
				if(self.__cvs_mark_opts.y.line.accuracy > max_zoom)
				{
					self.__cvs_mark_opts.x.line.accuracy = max_zoom
					self.__cvs_mark_opts.y.line.accuracy = max_zoom
				}
			}else
			{
				// 缩小
				self.__cvs_mark_opts.x.line.accuracy -= zoom_accuracy
				self.__cvs_mark_opts.y.line.accuracy -= zoom_accuracy
				if(self.__cvs_mark_opts.y.line.accuracy < min_zoom)
				{
					self.__cvs_mark_opts.x.line.accuracy = min_zoom
					self.__cvs_mark_opts.y.line.accuracy = min_zoom
				}
			}
			if(x_accuracy === self.__cvs_mark_opts.x.line.accuracy && self.__cvs_mark_opts.y.line.accuracy ===  y_accuracy)
				return
			clearTimeout(timer)
			self.__update_animate_flag = false
			self.__timers.forEach(item=>window.cancelAnimationFrame(item))
			self.__timers.splice(0,self.__timers.length)
			x_accuracy = self.__cvs_mark_opts.x.line.accuracy
			y_accuracy = self.__cvs_mark_opts.y.line.accuracy
			self.Clear()
			self.SetBackground()
			self.DrawAxis()
			self.DrawMark(posX,posY,pos_x_line,pos_y_line)
			timer = setTimeout(function(){
				self.__update_animate_flag = true
				self.RePrint()
			},100)
		}
		
		function sizeChange()
		{
			clearTimeout(timer)
			self.__cvs.width = self.__sync_ele.offsetWidth || window.innerWidth
			self.__cvs.height = self.__sync_ele.offsetHeight || window.innerHeight
			self.__cvs_wdt = self.__sync_ele.offsetWidth || window.innerWidth 
			self.__cvs_hgt = self.__sync_ele.offsetHeight || window.innerHeight
			self.__update_animate_flag = false
			self.Clear()
			self.SetBackground()
			self.DrawAxis()
			self.DrawMark(posX,posY,pos_x_line,pos_y_line)
			timer = setTimeout(function(){
				self.__update_animate_flag = true
				self.RePrint()
			},100)
		}
		
		if(self.__sync_ele)
			self.__sync_ele.addEventListener('resize',sizeChange,{'capture':false})
		
		this.__events_opts.forEach(function(name){
			switch(name)
			{
				case 'draw':
					self.__cvs.addEventListener(self.__event_type ? 'touchstart' : "mousedown",down,{'capture':false})
					self.__cvs.addEventListener(self.__event_type ? 'touchmove' : "mousemove",move,{'capture':false})
					window.addEventListener(self.__event_type ? 'touchend' : "mouseup",up,{'capture':false})
					break
				case 'zoom':
					self.__cvs.addEventListener('mousewheel',wheel,{'capture':false})
					break
			}
		})
		
		function removeEvnet()
		{
			self.__cvs.removeEventListener(self.__event_type ? 'touchstart' : "mousedown",down)
			self.__cvs.removeEventListener(self.__event_type ? 'touchmove' : "mousedown",move)
			self.__cvs.removeEventListener('mousewheel',wheel)
			self.__cvs.removeEventListener('mousedown',move)
			if(self.__sync_ele)
				self.__sync_ele.removeEventListener('resize',sizeChange)
			window.removeEventListener(self.__event_type ? 'touchend' : "mouseup",up)
		}
		return {destory:removeEvnet,change:(function(){
			let _flag = false
			return function(){
				self.__cvs.removeEventListener(self.__event_type ? 'touchstart' : "mousedown",down)
				self.__cvs.removeEventListener(self.__event_type ? 'touchmove' : "mousedown",move)
				window.removeEventListener(self.__event_type ? 'touchend' : "mouseup",up)
				self.__cvs.removeEventListener('mousedown',move)
				if(_flag)
				{
					select_point = {scale:false,radius:radius,value:{}}
					select_point.key = select_point.index = null
					if(showTip)
					{
						child_element.style.opacity = 0
						child_element.style.visibility = 'hidden'
					}
					self.__cvs.addEventListener(self.__event_type ? 'touchstart' : "mousedown",down,{'capture':false})
					self.__cvs.addEventListener(self.__event_type ? 'touchmove' : "mousemove",move,{'capture':false})
					window.addEventListener(self.__event_type ? 'touchend' : "mouseup",up,{'capture':false})
					
				}
				else
					self.__cvs.addEventListener('mousedown',move,{'capture':false})
				_flag = !_flag
			}
		})()}

	}
	
	FunctionPrinter.prototype.Destory = function(){
		this.__event_turn_off.destory()
		this.__update_animate_flag = false
		this.__timers.forEach(function(id){window.cancelAnimationFrame(id)})
		this.__timers.splice(0,this.__timers.length)
		this.Clear()
		setTimeout(()=>this.__cvs = this.__ctx = null)
	} 
	
	FunctionPrinter.prototype.ChangeTouch = function(){
		if(this.__event_type)
			this.__event_turn_off.change()
	}
	
	FunctionPrinter.prototype.Init = function(cvs,options){
		if(!(cvs instanceof HTMLCanvasElement))
			throw 'Invaild Canvas Element'
		this.ParseParams(options)
		this.__cvs = cvs
		this.__ctx = cvs.getContext('2d')
		this.__cvs_wdt = cvs.offsetWidth
		this.__cvs_hgt = cvs.offsetHeight
		this.__start_point = [parseInt(cvs.offsetWidth / 2),parseInt(cvs.offsetHeight / 2)]
		this.__start_point_values = [0,0]
		this.__maximum_point = {x:[0,0],y:[0,0]}
		this.__function_list = {}
		this.__animate_id = null
		this.__cache_time = 0
		this.__animate_queue = []
		this.__fn_points_list = {}
		this.__offset_move = {x:0,y:0}
		this.__offset_pos = {x:0,y:0}
		this.__update_animate_flag = true
		this.__timers = []
		this.__key_queue = []
		this.__event_type = 'ontouchstart' in document.documentElement
		this.SetBackground()
		this.DrawAxis()
		this.DrawMark(0,0,this.__cvs_mark_opts.x.line.width,this.__cvs_mark_opts.y.line.width)
		this.__event_turn_off = this.BindEvent()
	}
	
	function FunctionPrinter(cvs,options){
		this.__cvs = null
		this.__ctx = null
		this.Init(cvs,options)
	}
	
	return FunctionPrinter
	
})