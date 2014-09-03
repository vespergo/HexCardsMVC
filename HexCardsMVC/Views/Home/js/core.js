var HexBoard = function(){
    var slots = [];
    
    //initialize slots with null
    for(var i=0; i<19; i++){
        slots.push(null);
    }
    
    
    Draw = function(){
        for(var i=0; i<slots.length; i++){
           slots[i].Draw();
        }
    }   
}

function GameObject(imgFile, w, h, point, ctx){
  var self = this;
  var img = new Image();
  this.width = w;
  this.height = h;
  this.location = {x:point.x, y:point.y}
  
  img.onload = function(){
   self.Draw();
  };
  img.src = imgFile;
  
  self.Draw = function(){
    ctx.drawImage(img, this.location.x, this.location.y, this.width, this.height);
  }
  
  self.ContainsPoint = function(p){
    if(p.x > this.location.x && p.x < this.location.x+this.width && p.y > this.location.y && p.y < this.location.y+this.height){
      return true;
    }
    else{
      return false;
    }
  }
}

function getMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.pageX - rect.left,
    y: evt.pageY - rect.top
  };
}
