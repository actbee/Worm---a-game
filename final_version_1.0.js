let camgraph
let video
let canvas;
let test;
let istrack="Track Off";
let count="Solve Number:";
let randomlines_x=[];
let randomlines_y=[];
let myworm;
let myfield;
let mygarbage;
let mymonster;
let boundary=150;
let pause=false;
let gameover=false;
let again=100;
let shocktime=0;
let solvenum=0;
let scale=3;
let recolor=false;
let yesback=true;
let stop=true; //to detect whether the track mode is on
let trackloc;
let track;
let change_color=20;
let gamemode=1;
let coloroff=1;
let drag=false;  // delay background



class garbage{      // a single ball,eat it to get point  小球修改
  constructor(){
    this.origin_loc=createVector(random(boundary+scale*50,canvas.width-boundary-scale*50),random(boundary+scale*50,canvas.height-boundary-scale*50));
    this.lifespan=255;
    this.r=random(10*scale,15*scale);  //basic radius 小球基本半径
    this.changev=1;
    this.changea=0.005;
    this.dead=false;
    this.add_loc=createVector(0,0);
    this.loc_v=createVector(random(-1,1),random(-1,1));
    this.loc=p5.Vector.add(this.origin_loc,this.add_loc);
    this.freshyear=true;
    this.freshlife=0;
    this.explodenum=0;
    this.explodes=[];
    this.nocheck=0;
    this.autokilled=false;
    this.color=random(0,255);
  }
  update_killed(inx,iny,inn){
   if(this.dead==false && this.freshyear==false){
    if(abs(inx-this.loc.x)<this.r && abs(iny-this.loc.y)<this.r){
      if(myworm.issafe()==false){
        this.dead=true;
        this.explodebegin(inx,iny,this.r*this.changev);
      }
    }
    else{
    for(let i=0;i<mymonster.monsters.length;i++){
      let safe=15*scale;
    if(this.origin_loc.x>=mymonster.monsters[i].loc.x-safe
      && this.origin_loc.x<mymonster.monsters[i].loc.x+mymonster.monsters[i].sizex+safe
       && this.origin_loc.y>=mymonster.monsters[i].loc.y-safe
        && this.origin_loc.y<mymonster.monsters[i].loc.y+mymonster.monsters[i].sizey+safe){
          this.dead=true;
          this.autokilled=true;
      }
    }
  }

    }

    else if(this.dead==true){
      this.explode(inn);
    //  console.log("exploding!");
    }
    
  }

  explodebegin(inx,iny){
    this.explodenum=this.r*this.changev/scale;
    for(let i=0;i<this.explodenum;i++){
       this.explodes.push(new explodeball(inx,iny));
    }
  //  console.log("a new explode begin!");
  }

   explode(inn){
     for(let i=0;i<this.explodenum;i++){
       if(this.explodes[i].already_dead()==true){
         this.explodenum--;
         this.explodes.splice(i,1);
       }
     }
     for(let i=0;i<this.explodenum;i++){
       this.explodes[i].update(inn);
     }
   }

  render(){   //way to draw garbage 小球绘制方式
    this.update_killed(myworm.location.x,myworm.location.y,this.color);

    if(this.isdead()!=true){
    push();
    //if the garbage is just appear, show it snowly
    if(this.freshyear==true){   //freshyear is when a new garbage is appearing 这是小球刚出现的时候
      strokeWeight(this.freshlife*this.r*this.changev/2000);   //stroke of garbage 小球边的绘制，后同
    //  strokeWeight(0);   
      colorMode(HSB,360,255,100);
      fill(this.color+100*sin(millis()/1000),105*(0.5+this.freshlife/500),100*(0.5+this.freshlife/500)); 
  //    fill(150,150,150,this.freshlife); //color of garbage 小球颜色的绘制，后同
    }
    else{
    strokeWeight(this.lifespan*this.r*this.changev/2000); 
    colorMode(HSB,360,255,100);
    fill(this.color+100*sin(millis()/1000),105*(0.2+this.lifespan/318),100*(0.2+this.lifespan/318)); 
 //   fill(150,150,150,this.lifespan);
    }

    this.hit(); 
    this.loc=p5.Vector.add(this.add_loc,this.origin_loc);
    ellipse(this.loc.x,this.loc.y,this.r*this.changev,this.r*this.changev);

    if(abs(this.add_loc.x)>50*scale){
      this.loc_v.x*=-1;
    }
    this.add_loc.x+=this.loc_v.x;
    if(abs(this.add_loc.y)>50*scale){
      this.loc_v.y*=-1;
    }
    this.add_loc.y+=this.loc_v.y;
    if(this.changev>=1.3||this.changev<=0.7){
        this.changea*=-1;
    }
    this.changev+=this.changea
    pop();
    if(this.freshyear==true){
    if(this.freshlife<250){
      this.freshlife+=5;
    }
    else{
      this.freshyear=false;
    }
  }
    if(this.dead==true){
      this.lifespan-=10;
    }
  }
  }

  isdead(){
    if(this.lifespan<0){
      return true;
    }
    else{
      return false;
    }
  }

  hit(){
    if(this.nocheck>0){
      this.nocheck--;
      return;
    }
    for(let i=0;i<mymonster.monsters.length;i++){
      let x1=mymonster.monsters[i].loc.x;
      let x2=mymonster.monsters[i].loc.x+mymonster.monsters[i].sizex;
      let y1=mymonster.monsters[i].loc.y;
      let y2=mymonster.monsters[i].loc.y+mymonster.monsters[i].sizey;
      let rr=this.r*this.changev;
        if(((this.loc.x+rr>=x1&&this.loc.x<x2)&&(this.loc.y>y1&&this.loc.y<y2))
        ||((this.loc.x-rr<=x2&&this.loc.x>x1)&&(this.loc.y>y1&&this.loc.y<y2))
        ||((this.loc.y+rr>=y1&&this.loc.y<y2)&&(this.loc.x>x1&&this.loc.x<x2))
        ||((this.loc.y-rr<=y2&&this.loc.y>y1)&&(this.loc.x>x1&&this.loc.x<x2))){
          this.loc_v.x*=-1;
          this.loc_v.y*=-1;
          this.nocheck=5;
        }
    }
  }

}

class garbagesystem{    //the ball system, manage all the balls
  constructor(){
    this.max=5*scale;
    this.num=Math.floor(random(scale,4*scale));
    this.garbages=[];
    for(let i=0;i<this.num;i++){
      this.garbages.push(new garbage());
    }
  }
  update(){
    for(let i=0;i<this.num;i++){
      if(this.garbages[i].isdead()==true){
        if(this.garbages[i].autokilled==false){
        solvenum++;
        }
        this.garbages.splice(i,1);
        this.num--;
      
        this.reborn();
      }
    }
    for(let i=0;i<this.num;i++){
      this.garbages[i].render();
    }
  }
  reborn(){
     let add=Math.floor(random(0,this.max-this.num))+1;
     //console.log(add);
     for(let i=0;i<add;i++){
       this.garbages.push(new garbage());
       this.num++;
     //  console.log("made new one!");
     }
  }
}

class explodeball{            //part of the exploding effect
  constructor(inx,iny){
     this.v=createVector(random(-0.5*scale,0.5*scale),random(-0.5*scale,0.5*scale));
     this.lifespan=255;
     this.a=createVector(random(-0.3*scale,0.3*scale),random(-0.3*scale,0.3*scale));
     this.location=createVector(inx,iny);
     this.r=random(1*scale,10*scale);
     this.isdead=false;
  }
  update(inn){
    if(this.already_dead()==false){
    this.location.add(this.v);
    if(this.v.mag()<2){
    this.v.add(this.a);
    }
    this.render(inn);
    this.lifespan-=10;
    }
  }
  render(inn){
    push();
   // strokeWeight(this.lifespan*this.r);
  //  fill(144+sin(millis() / 1000)*144,10,10,this.lifespan);
   // fill(150,this.lifespan);
   colorMode(HSB,360,255,100);
   fill(inn+100*sin(millis()/1000),105*(this.lifespan/255),100*(this.lifespan/255)); 
    ellipse(this.location.x,this.location.y,this.r,this.r);
    //ellipse(100,100,1000,1000);
   // console.log("exploding drawing");
   // console.log(this.r);
    pop();
  }
  already_dead(){
    if(this.lifespan<0){
      return true;
    }
    else{
      return false;
    }
  }
}

class yline{   //part of the background
  constructor(){
    this.x=random(0,canvas.width);
    this.v=random(-2,2);
  }
  update(){
    this.x+=this.v;
    this.draw();
    if(this.x<0||this.x>canvas.width){
      this.v*=-1;
    }
  }
  draw(){
    push();
    smooth();
    strokeWeight(0.2*scale);
    stroke(150);
    line(this.x,0,this.x,canvas.height);
    pop();
  }
}
class xline{   //part of the background
  constructor(){
    this.y=random(0,canvas.height);
    this.v=random(-2,2);
  }
  update(){
    this.y+=this.v;
    this.draw();
    if(this.y<0||this.y>canvas.height){
      this.v*=-1;
    }
  }
  draw(){
    push();
    smooth();
    stroke(150);
    strokeWeight(0.2*scale);
    line(0,this.y,canvas.width,this.y);
    pop();
  }
}

class fieldpoint{  // single point,part of the field 修改网格扩张方式
  constructor(inx,iny){
    this.origin_loc=createVector(inx,iny);  
    this.add_loc=createVector(0,0);
    this.limit=10*scale;   //max span distance 最大扩张距离
    this.final_loc=p5.Vector.add(this.origin_loc,this.add_loc);
    this.r=2.5*scale;  
  }
  update(){
    this.add_loc.setMag(0);
    this.check();
   // this.drawpoint();
  }
  check(){
      let dis=p5.Vector.sub(this.origin_loc,myworm.location);
      let checklength=myworm.segNum*myworm.segLength;
      if(dis.mag()<checklength*0.75){
          this.add_loc.add(dis);
       //   let value=map(dis.mag(),0,checklength,50,0);
        //  let value=200/dis.mag();
        //  this.add_loc.setMag(value);
      }
      this.add_loc.setMag(20*scale);
      let addmore=createVector(0,0);
      for(let i=0;i<mygarbage.garbages.length;i++){
        let dis=p5.Vector.sub(this.origin_loc , mygarbage.garbages[i].loc);
        let checklength2=mygarbage.garbages[i].r*mygarbage.garbages[i].changev;
        if(dis.mag()<checklength2){
          //this.add_loc.add(dis);
          dis.setMag(checklength2);
          addmore.add(dis);
        }
     }
     addmore.setMag(10*scale);
     this.add_loc.add(addmore);
     if(this.add_loc.mag()>this.limit){
       this.add_loc.setMag(this.limit);
     }
  //   this.add_loc.setMag(20);
  this.final_loc=p5.Vector.add(this.origin_loc,this.add_loc);
}
  drawpoint(){
    push();
    fill(170);
    ellipse(this.final_loc.x,this.final_loc.y,10,10);
    pop();
  }
}

class fieldsystem{  // the background net 修改网格
  constructor(){
    this.fieldpoints=[];     
    this.xnum=0;
    this.ynum=0;
    this.gap=20*scale;     //distance betweent neighbor net points 网格间距
  }
  createfield(){
    let fieldwidth=canvas.width-2*boundary;
    let fieldheight=canvas.height-2*boundary;
   // let xnum=Math.floor(fieldwidth/gap);
   // let ynum=Math.floor(fieldheight/gap);
    this.xnum=fieldwidth/this.gap+1;
    this.ynum=fieldheight/this.gap+1;
    for(let j=0;j<this.ynum;j++){
      for(let i=0;i<this.xnum;i++){
        this.fieldpoints.push(new fieldpoint(boundary+this.gap*i,boundary+this.gap*j));
      }
    }
  }
  field(){
    for(let i=0;i<this.fieldpoints.length;i++){
      this.fieldpoints[i].update();
    }
    //this.checkpoint();
    push();
      colorMode(HSB,360,255,150);
      stroke(100+100*sin(millis()/1000),105,200);  // color of network 网格颜色 
    //  stroke(120+120*sin(millis()/1000),0,0);
      
    //  stroke(80,80,80);
      strokeWeight(0.4*scale);  // weight of network 网格粗细
      for(let i=0;i<this.xnum;i++){
        for(let j=0;j<this.ynum;j++){
          if(i+1<this.xnum){
            line(this.fieldpoints[i+j*this.xnum].final_loc.x , this.fieldpoints[i+j*this.xnum].final_loc.y , this.fieldpoints[i+j*this.xnum+1].final_loc.x , this.fieldpoints[i+j*this.xnum+1].final_loc.y);
          }
         if(j+1<this.ynum){
            line(this.fieldpoints[i+j*this.xnum].final_loc.x , this.fieldpoints[i+j*this.xnum].final_loc.y , this.fieldpoints[i+(j+1)*this.xnum].final_loc.x , this.fieldpoints[i+(j+1)*this.xnum].final_loc.y );
          }
        }
      }
    pop();
 }
 checkpoint(){     //this function is used to debug
  text(this.xnum+","+this.ynum,500,30,650,30);
   for(let i=0;i<this.fieldpoints.length;i++){
    if(abs(mouseX-this.fieldpoints[i].final_loc.x)<10&&abs(mouseY-this.fieldpoints[i].final_loc.y)<10)
    text("points "+i,400,canvas.height-50,550,canvas.height-10);
   }
   for(let j=0;j<this.ynum;j++){
     for(let i=0;i<this.xnum;i++){
      if(abs(mouseX-this.fieldpoints[i+j*this.xnum].final_loc.x)<10&&abs(mouseY-this.fieldpoints[i+j*this.xnum].final_loc.y)<10)
      {
       text("point "+i+","+j,10,canvas.height-50,150,canvas.height-10);
     let num=i*this.ynum+j;
     text("point "+num,700,canvas.height-50,850,canvas.height-10);
      }
     }
   }
  
 }
}

class worm{   // the hero  小虫
  constructor(){
    this.v=createVector(random(-0.5*scale,0.5*scale),random(-0.5*scale,0.5*scale));
    this.a=createVector(random(-0.*scale,0.5*scale),random(-0.5*scale,0.5*scale));
    this.location=createVector(random(boundary,canvas.width-boundary),random(boundary,canvas.height-boundary));
    this.segNum=5;    //here to change the life of our hero 设置血量
    this.segLength=10*scale;
    this.x=[];
    this.y=[];
    this.safe=0;
    for (let i=0;i<this.segNum;i++) {
      this.x[i]=0;
      this.y[i]=0;
    }
  }
   update(){
    if(stop==true){
    this.a=createVector(random(-0.5*scale,0.5*scale),random(-0.5*scale,0.5*scale));
    this.location.add(this.v);
    this.v.add(this.a);
    }
    else if(stop==false){
     // this.v=createVector(random(-0.5,0.5),random(-0.5,0.5));
     if(gamemode==1){
      this.location=createVector(trackloc.x,trackloc.y);
     }
     else if(gamemode==2){
      let dis=p5.Vector.sub(trackloc,this.location);
      this.v=createVector(dis.x,dis.y);
      this.v.setMag(random(2*scale,4*scale));
      this.location.add(this.v);
     }
     else if(gamemode==3){
      let dis=p5.Vector.sub(trackloc,this.location);
      this.a=createVector(dis.x,dis.y);
      this.a.setMag(random(0.5*scale,1.5*scale));
      this.v.add(this.a);
      if(this.v.mag()>8*scale){
        this.v.setMag(8*scale);
      }
      this.location.add(this.v);
      }
    }
  }


  render(){
    push();
    this.update();
    this.checkedge();
    this.checkhit();
    this.dragworm(0,this.location.x,this.location.y);
  // this.dragworm(0,mouseX,mouseY);  //the head
    for (let i=0;i<this.x.length-1;i++) {
    this.dragworm(i+1,this.x[i],this.y[i]); //the body
    }
    pop();
}
  checkedge(){
    let reverse=false;
    if(this.location.x<=5){
       if(this.v.x<0){
         this.v.x=1;
       }
       if(this.a.x<0){
         this.a.x*=-2;
       }
       reverse=true;
    }
    else if(this.location.x>=canvas.width-5){
      if(this.v.x>0){
        this.v.x=-1;
      }
      if(this.a.x>0){
        this.a.x*=-2;
      }
      reverse=true;
    }
    if(this.location.y<=5){
       if(this.v.y<0){
         this.v.y=1;
       }
       if(this.a.y<0){
         this.a.y*=-2;
       }
       reverse=true;
    }
    else if(this.location.y>=canvas.height-5){
      if(this.v.y>0){
        this.v.y=-1;
      }
      if(this.a.y>0){
        this.a.y*=-2;
      }
      reverse=true;
    }
    if(reverse==true){
    constrain(this.v.x,-0.75*scale,0.75*scale);
    constrain(this.v.y,-0.75*scale,0.75*scale);
    }
}
  checkhit(){
    if(this.safe>0){
      this.safe--;
      return;
    }
    for(let i=0;i<mymonster.monsters.length;i++){
      let x1=mymonster.monsters[i].loc.x;
      let x2=mymonster.monsters[i].loc.x+mymonster.monsters[i].sizex;
      let y1=mymonster.monsters[i].loc.y;
      let y2=mymonster.monsters[i].loc.y+mymonster.monsters[i].sizey;
      if(this.location.x>x1 && this.location.x<x2 && this.location.y>y1 && this.location.y<y2){
          this.x.splice(this.segNum-1,1);
          this.y.splice(this.segNum-1,1);
          this.segNum--;
          this.safe=50;
          shocktime=30;
      }
    }
  }

 dragworm( i, xin,yin) {
  let dx=xin-this.x[i];
  let dy=yin-this.y[i];
  let angle=atan2(dy,dx);
  this.x[i]=xin-cos(angle)*this.segLength;
  this.y[i]=yin-sin(angle)*this.segLength;
  push();
  strokeWeight(scale);
  //stroke(205,51,51);
  translate(this.x[i],this.y[i],angle);
  rotate(angle);
 // line(0,0,this.segLength,0);
 if(i==0){
   push();
   fill(200);
   ellipse(0,0,this.segLength,this.segLength);
   pop();
  }
  else{
  ellipse(0,0,this.segLength/2,this.segLength/2);
  }
  pop();
}
  issafe(){
    if(this.safe>0){
      return true;
    }
    else{
      return false;
    }
  }
  isdead(){
    if(this.segNum<=0){
      return true;
    }
    else{
      return false;
    }
  }
}

class monstersystem{  //control all the monsters
  constructor(){
    this.num=3;
    this.monsters=[];
    this.difficult=0;
    for(let i=0;i<this.num;i++){
      this.monsters.push(new monster_static());
    }
  }
  update(){
    if(solvenum-this.difficult>5){
      this.difficult=solvenum;
      this.more();
    }
    for(let i=0;i<this.num;i++){
      this.monsters[i].render();
    }
  }
  more(){
    let addnum=this.difficult/5;
    for(let i=0;i<addnum;i++){
      this.monsters.push(new monster_static());
      this.num++;
    }
  }
}

class monster_base{  //the father of all monsters
  constructor(value_a){
    this.add_loc=createVector(0,0);
    this.origin_loc=createVector(random(100*scale,width-100*scale),random(100*scale,height-100*scale));
    this.loc=p5.Vector.add(this.add_loc,this.origin_loc);
    this.v=createVector(0,0);
    this.a=createVector(value_a.x,value_a.y);
    this.addmax=20;
    this.vmax=2;
  }
  update(){
     this.v.add(this.a);
     constrain(this.v,-this.vmax,this.vmax);
     this.add_loc.add(this.v);
     if(this.add_loc>this.addmax){
       this.a*=-1;
     }
     this.loc=p5.Vector.add(this.add_loc,this.origin_loc);
  }
}

class monster_static extends monster_base{ // basic static monster 方块绘制
  constructor(){
    super(createVector(0,0));
    this.sizex=15*scale;
   // this.sizey=random(10,40);
    this.sizey=this.sizex;
  }
  render(){
    push();
    strokeWeight(scale*2);  //stroke of monster 方块的边
    stroke(130+110*sin(millis()/1000),0,0);
    //console.log(change_color);
  /*  colorMode(HSB,360,255,150);
    fill(1,175+50*sin(millis()/1000),70+20*sin(millis()/1000)); //color of monster 方块的颜色*/
    fill(225+25*sin(millis()/1000));
    rect(this.loc.x,this.loc.y,this.sizex,this.sizey,abs(sin(millis()/1000)*scale));
    //this.eye();  
    pop();
  }
  eye(){  //eye of monster 方块中间的圆
    push();
    let shift=5*scale;
    let eyewidth=this.sizex/4;
    let eyeheight=this.sizey/4;
    strokeWeight(sqrt(eyewidth*eyeheight)/2); //stroke of eye 圆的边
    let eyex=map(myworm.location.x,0,canvas.width,this.loc.x+shift,this.loc.x+this.sizex-shift);
    let eyey=map(myworm.location.y,0,canvas.height,this.loc.y+shift,this.loc.y+this.sizey-shift);
    ellipse(eyex,eyey,eyewidth,eyeheight);
    pop();
  }  
}


function reset(){
  myworm=new worm();
  mygarbage=new garbagesystem();
  mymonster=new monstersystem();
  myfield=new fieldsystem();
  myfield.createfield();
  gameover=false;
  shocktime=0;
  solvenum=0;
  again=100;
  if(recolor==false){
 }
}

function setup() {
//canvas=createCanvas(windowWidth,windowHeight);
 canvas=createCanvas(1920,1080);
 canvas.position(0,0);
 createrandomlines();
 camgraph=createCapture(VIDEO);
 camgraph.hide();
 //camgraph.id("captured_video");
  video=createGraphics(60*scale,45*scale);
  //track=color(0,0,0);
   frameRate(60);
  reset();
  trackloc=createVector(random(0,canvas.width),random(0,canvas.height));
  let c=get(trackloc);
  //track=color(Math.floor(random(0,255)),Math.floor(random(0,255)),Math.floor(random(0,255)));
  track=color(red(c),green(c),blue(c));
  smooth();
  pixelDensity(1);
}

function draw() {
  
  if(pause==false){
    if(myworm.isdead()){
      let red=map(again,0,100,0,200);
      background(red,0,0);
      gameover=true;
      if(again>0){
        again--;
      }
      else{
        let delay=50000;
        while(delay>0){
          delay--;
        }
        reset();
      }
    }
    else{  
  drawbackground();
  //noisearea();
  randomlines();
  shocking();
  myfield.field();
  mygarbage.update();
  mymonster.update();
  myworm.render();
  hand();
  drawvideo();
  findtrack();
  }
}
  showtext();
}

function drawvideo(){
  video.push();
  video.translate(video.width,0);
  video.scale(-1,1);
  video.image(camgraph,0,0,video.width,video.height);
  video.pop();
  if(yesback==true){
  push();
  tint(255, 127);
  image(video,0,canvas.height-video.height);
  pop();
}
}

function drawbackground(){
  if(drag==true){
    background(change_color,30);
  }
  else if(drag==false){
    background(change_color);
  }
  if(change_color>40||change_color<10){
    coloroff*=-1;
  }
  change_color+=coloroff;
}

function keyTyped(){

  if(key=='w'||key=='W'){
    yesback=true;
  }
  else if(key=='s'||key=='S'){
    yesback=false;
  }
  else if(key=='t'||key=='T'){
      stop=false;

      istrack="Track On";
    }
  else if(key=='f'||key=='F'){
      stop=true;
      istrack="Track Off";
    }
  else if(key=="p"||key=='P'){
      if(pause==true){
        pause=false;
      }
      else{
        pause=true;
      }
    }
  else if(key=="1"){
      if(recolor==true){
        recolor=false;
      }
      else{
        recolor=true;
      }
    }
  else if(key=="2"){
      if(drag==false){
      drag=true;
      }
      else if(drag==true){
        drag=false;
      }
    }
  else if(key=="3"){
     if(gamemode==1){
       gamemode=2;
     }
     else if(gamemode==2){
       gamemode=3;
     }
     else if(gamemode==3){
       gamemode=1;
     }
  }
  }

function showtext(){
  if(recolor==true){
    push();
    textSize(18*scale);
    text("Select Color: ("+floor(red(track))+","+green(track)+","+blue(track)+")",10*scale,10*scale,550*scale,50*scale);
    pop();
    reset();
    return;
  }
  if(pause==true){
    push();
    textSize(100*scale);
    noStroke();
    fill(0,102,153);
    text("PAUSE",canvas.width/2-150*scale,canvas.height/3,canvas.width/2+150*scale,2*canvas.hegiht/3);
    pop();
    return;
  }
  if(gameover==true){
    push();
    textSize(50*scale);
    noStroke();
    fill(205,0,0);
    text("GAME OVER",canvas.width/2-150*scale,canvas.height/4,canvas.width/2+150*scale,3*canvas.hegiht/4);
    text("Total:"+solvenum,canvas.width/2-100*scale,canvas.height/2,canvas.width/2+100*scale,2*canvas.hegiht/3);
    pop();
    return;
  }
  else{
  push();
  textSize(18*scale);
  noStroke();
  fill(0,102,153);
  text(istrack,10*scale,10*scale,150*scale,50*scale);
   text(count+solvenum,canvas.width-160*scale,scale*10,canvas.width-60*scale,scale*50);
   if(stop==false){
    if(gamemode==1){
      text("EASY",canvas.width/2-30*scale,scale*10,canvas.width/2+30*scale,scale*50);
    }
    else if(gamemode==2){
      text("MIDDLE",canvas.width/2-50*scale,scale*10,canvas.width/2+50*scale,scale*50);
    }
    else if(gamemode==3){
      text("HARD",canvas.width/2-30*scale,scale*10,canvas.width/2+30*scale,scale*50);
    }
  }
   pop();
   return;
  }
}

function createrandomlines(){
   let randomx=(canvas.width/1000)*random(1,3);
   let randomy=(canvas.height/1000)*random(1,3);
   for(let i=0;i<randomx;i++){
     randomlines_x.push(new yline());
   }
   for(let i=0;i<randomy;i++){
    randomlines_y.push(new xline());
  }
}

function randomlines(){
  for(let i=0;i<randomlines_x.length;i++){
    randomlines_x[i].update();
  }
  for(let i=0;i<randomlines_y.length;i++){
    randomlines_y[i].update();
  }
}

function mouseClicked(){
  if(recolor==true){
    track=get(mouseX,mouseY);
    trackloc.x=mouseX;
    trackloc.y=mouseY;
    return;
  }
  let tox=constrain(mouseX,0,canvas.width);
  let toy=constrain(mouseY,0,canvas.height);
  myworm.location.x=tox;
  myworm.location.y=toy;
}

function shocking(){
  if(shocktime>0){
    canvas.position(random(-10,10),random(-10,10));
    push();
    fill(250,0,0,shocktime*30);
    rect(0,0,canvas.width,canvas.height);
    pop();
    shocktime--;
  }
}

function hand(){
  if(stop==false){
   push();
   noFill();
   let num=random(5,10);
   let r=random(10*scale,20*scale);
   for(let i=0;i<num;i++){
    stroke(red(track),green(track),blue(track));
   ellipse(trackloc.x+random(-15,15),trackloc.y+random(-15,15),r,r);
   }
   pop();
  }
}

function findtrack(){
  if(recolor==true){
    push();
     image(video,0,0,canvas.width,canvas.height);
     fill(red(track),green(track),blue(track));
     rect(10*scale,40*scale,40*scale,40*scale);
     ellipse(trackloc.x,trackloc.y,20.20);
     hand();
     pop();
     return;
  }
  else if(recolor==false && stop==false){
    let record=99999;
    video.loadPixels();
    let closest=createVector(random(0,video.width),random(0,video.height));

    let x1=Math.floor(trackloc.x/(canvas.width/video.width)-video.width/5);
    if(x1<0){
      x1=0;
    }
    let x2=Math.floor(trackloc.x/(canvas.width/video.width)+video.width/5);
    if(x2>video.width-1){
      x2=video.width-1;
    }
    let y1=Math.floor(trackloc.y/(canvas.width/video.width)-video.height/5);
    if(y1<0){
      y1=0;
    }
    let y2=Math.floor(trackloc.y/(canvas.width/video.width)+video.height/5);
    if(y2>video.height-1){
      y2=video.height-1;
    }
    console.log(x1+","+x2+","+y1+","+y2);
    for(let i=x1;i<x2;i++){
      for(let j=y1;j<y2;j++){
        let id=4*(i+j*video.width);
        let r=video.pixels[id];
        let g=video.pixels[id+1];
        let b=video.pixels[id+2];
        let d=dist(r,g,b,red(track),green(track),blue(track));
        if(d<record){
          record=d;
          closest.x=i;
          closest.y=j;
        }
      }
    }
  /*  for(let i=0;i<video.width;i++){
      for(let j=0;j<video.height;j++){
        let id=4*(i+j*video.width);
        let r=video.pixels[id];
        let g=video.pixels[id+1];
        let b=video.pixels[id+2];
        let d=dist(r,g,b,red(track),green(track),blue(track));
        if(d<record){
          record=d;
          closest.x=i;
          closest.y=j;
        }
      }
    }*/
  //  console.log(record);
    if(record<150){
     let newx=closest.x*(canvas.width/video.width);
     let newy=closest.y*(canvas.height/video.height);
     if(abs(trackloc.x-newx)<canvas.width/5 && abs(trackloc.y-newy)<canvas.height/5){
       trackloc.x=newx;
       trackloc.y=newy;
     }
    }
  }
}
