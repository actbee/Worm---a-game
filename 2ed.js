let camgraph
let video
let canvas;
let track;
let yesback=0;
let stop=0; //to detect whether the track mode is on
let istrack="Track Off";
let count="Solve Number:";
let randomlines_x=[];
let randomlines_y=[];
let myworm;
let myfield;
let mygarbage;
let zoff=0.0;
let addzoff=1;
let boundary=50;

class explodeball{
  constructor(inx,iny){
     this.v=createVector(random(-0.2,0.2),random(-0.2,0.2));
     this.lifespan=255;
     this.a=createVector(random(-0.1,0.1),random(-0.1,0.1));
     this.location=createVector(inx,iny);
     this.r=random(1,10);
     this.isdead=false;
  }
  update(){
    if(this.already_dead()==false){
    this.location.add(this.v);
    if(this.v.mag()<1){
    this.v.add(this.a);
    }
    this.render();
    this.lifespan-=10;
    }
  }
  render(){
    push();
    //strokeWeight(this.lifespan);
    fill(144+addzoff*0.7,zoff+addzoff*0.5,zoff+addzoff,this.lifespan);
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


class garbage{
  constructor(){
    this.origin_loc=createVector(random(100,width-100),random(100,height-100));
    this.lifespan=255;
    this.r=random(10,30);
    this.changev=1;
    this.changea=0.005;
    this.dead=false;
    this.add_loc=createVector(0,0);
    this.loc_v=createVector(random(-0.5,0.5),random(-0.5,0.5));
    this.loc=p5.Vector.add(this.origin_loc,this.add_loc);
    this.freshyear=true;
    this.freshlife=0;
    this.explodenum=0;
    this.explodes=[];
  }
  update_killed(inx,iny){
    if(this.dead==false && this.freshyear==false){
    if(abs(inx-this.loc.x)<this.r&&abs(iny-this.loc.y)<this.r){
        this.dead=true;
        this.explodebegin(inx,iny);
    }
    }
    else if(this.dead==true){
      this.explode();
    //  console.log("exploding!");
    }
  }

  explodebegin(inx,iny){
    this.explodenum=this.r*this.changev;
    for(let i=0;i<this.explodenum;i++){
       this.explodes.push(new explodeball(inx,iny));
    }
  //  console.log("a new explode begin!");
  }

   explode(){
     for(let i=0;i<this.explodenum;i++){
       if(this.explodes[i].already_dead()==true){
         this.explodenum--;
         this.explodes.splice(i,1);
       }
     }
     for(let i=0;i<this.explodenum;i++){
       this.explodes[i].update();
       console.log(this.explodes[i].lifespan);
       console.log(this.lifespan);
     }
   }

  render(){
    this.update_killed(myworm.location.x,myworm.location.y);
    if(this.isdead()!=true){
    push();
    if(this.freshyear==true){
      strokeWeight(this.freshlife*this.r*this.changev/2000);
      fill(144+addzoff*0.7,zoff+addzoff*0.5,zoff+addzoff,this.freshlife);
    }
    else{
    strokeWeight(this.lifespan*this.r*this.changev/2000);
    fill(144+addzoff*0.7,zoff+addzoff*0.5,zoff+addzoff,this.lifespan);
    }
    this.loc=p5.Vector.add(this.add_loc,this.origin_loc);
    ellipse(this.loc.x,this.loc.y,this.r*this.changev,this.r*this.changev);
    if(abs(this.add_loc.x)>50){
      this.loc_v.x*=-1;
    }
    this.add_loc.x+=this.loc_v.x;
    if(abs(this.add_loc.y)>50){
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
      console.log("finish a new ball");
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
}

class garbagesystem{
  constructor(){
    this.max=10;
    this.solvenum=0;
    this.num=Math.floor(random(5,10));
    this.garbages=[];
    for(let i=0;i<this.num;i++){
      this.garbages.push(new garbage());
    }
  }
  update(){
    for(let i=0;i<this.num;i++){
      if(this.garbages[i].isdead()==true){
        this.garbages.splice(i,1);
        this.num--;
        this.solvenum++;
        this.reborn();
        console.log("solve one!");
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
class yline{
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
    strokeWeight(0.5);
    line(this.x,0,this.x,canvas.height);
    pop();
  }
}
class xline{
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
    strokeWeight(0.5);
    line(0,this.y,canvas.width,this.y);
    pop();
  }
}
class fieldpoint{
  constructor(inx,iny){
    this.origin_loc=createVector(inx,iny);
    this.add_loc=createVector(0,0);
    this.final_loc=p5.Vector.add(this.origin_loc,this.add_loc);
    this.r=2.5;
  }
  update(myworm){
    this.check(myworm);
    this.drawpoint();
  }
  check(myworm){
      let dis=p5.Vector.sub(this.origin_loc,myworm.location);
      let checklength=myworm.segNum*myworm.segLength;
      //console.log(checklength);
      if(dis.mag()<checklength){
          this.add_loc=dis;
          this.add_loc.normalize();
          //let value=map(dis.mag(),0,checklength,10,0);
          let value=20/dis.mag();
          this.add_loc.setMag(value);
      }
      else{
        this.add_loc=0;
      }
      this.final_loc=p5.Vector.add(this.origin_loc,this.add_loc);
  }
  drawpoint(){
    push();
    fill(170);
   // ellipse(this.final_loc.x,this.final_loc.y,10,10);
    pop();
  }
}
class fieldsystem{
  constructor(){
    this.fieldpoints=[];
    this.xnum=0;
    this.ynum=0;
  }
  createfield(){
    let gap=25;
    let fieldwidth=canvas.width-2*boundary;
    let fieldheight=canvas.height-2*boundary;
   // let xnum=Math.floor(fieldwidth/gap);
   // let ynum=Math.floor(fieldheight/gap);
    this.xnum=fieldwidth/gap+1;
    this.ynum=fieldheight/gap+1;
    for(let i=0;i<this.ynum;i++){
      for(let j=0;j<this.xnum;j++){
        this.fieldpoints.push(new fieldpoint(boundary+gap*j,boundary+gap*i));
      }
    }
  }
  field(myworm){
    for(let i=0;i<this.fieldpoints.length;i++){
      this.fieldpoints[i].update(myworm);
    }
    push();
      stroke(100,11,zoff);
      strokeWeight(2);
      for(let j=0;j<this.ynum;j++){
        for(let i=0;i<this.xnum;i++){
          if(i+1<this.xnum){
            line(this.fieldpoints[j*this.ynum+i].final_loc.x , this.fieldpoints[j*this.ynum+i].final_loc.y , this.fieldpoints[j*this.ynum+i+1].final_loc.x , this.fieldpoints[j*this.ynum+i+1].final_loc.y);
          }
          if(j+1<this.ynum){
            line(this.fieldpoints[j*this.ynum+i].final_loc.x , this.fieldpoints[j*this.ynum+i].final_loc.y , this.fieldpoints[(j+1)*this.ynum+i].final_loc.x , this.fieldpoints[(j+1)*this.ynum+i].final_loc.y );
          }
        }
      }
      zoff+=addzoff;
      if(zoff>=255||zoff<=0){
        addzoff*=-1;
      }
    pop();
 }
}
class worm{
  constructor(){
    this.v=createVector(random(-0.5,0.5),random(-0.5,0.5));
    this.a=createVector(random(-0.5,0.5),random(-0.5,0.5));
    this.location=createVector(random(0,width),random(0,height));
    this.segNum=10;
    this.segLength=10;
    this.x=[20];
    this.y=[20];
    for (let i=0;i<this.segNum;i++) {
      this.x[i]=0;
      this.y[i]=0;
    }
  }
   updatetrack(inx,iny){
   /* v.x=random(-2,2);
    v.y=random(-2,2);
    a.x=random(-2,2);
    a.y=random(-2,2);*/
    this.v.x=random(-0.5,0.5);
    this.v.y=random(-0.5,0.5);
    this.a.x=random(-0.5,0.5);
    this.a.y=random(-0.5,0.5);
    this.location.x=inx;
    this.location.y=iny;
  }
   update(){
    this.a.x=random(-0.5,0.5);
    this.a.y=random(-0.5,0.5);
    this.location.add(this.v);
    this.v.add(this.a);
  }
  rendertrack(nowx,nowy){
    strokeWeight(19);
    stroke(205,51,51);
    this.updatetrack(nowx,nowy);
    this.checkedge();
    dragworm(0,nowx,nowy);
    for (let i=0;i<x.length-1;i++) {
    dragworm(i+1,x[i],y[i]);
  }
  }
  render(){
    push();
    this.update();
    this.checkedge();
    this.dragworm(0,this.location.x,this.location.y);
  // this.dragworm(0,mouseX,mouseY);  //the head
    for (let i=0;i<this.x.length-1;i++) {
    this.dragworm(i+1,this.x[i],this.y[i]); //the body
    }
    pop();
  }
  checkedge(){
    if(this.location.x<=5){
       if(this.v.x<0){
         this.v.x=1;
       }
       if(this.a.x<0){
         this.a.x*=-2;
       }
    }
    else if(this.location.x>=canvas.width-5){
      if(this.v.x>0){
        this.v.x=-1;
      }
      if(this.a.x>0){
        this.a.x*=-2;
      }
    }
    if(this.location.y<=5){
       if(this.v.y<0){
         this.v.y=1;
       }
       if(this.a.y<0){
         this.a.y*=-2;
       }
    }
    else if(this.location.y>=canvas.height-5){
      if(this.v.y>0){
        this.v.y=-1;
      }
      if(this.a.y>0){
        this.a.y*=-2;
      }
    }
    constrain(this.v.x,-0.75,0.75);
    constrain(this.v.y,-0.75,0.75);
}
 dragworm( i, xin,yin) {
  let dx=xin-this.x[i];
  let dy=yin-this.y[i];
  let angle=atan2(dy,dx);
  this.x[i]=xin-cos(angle)*this.segLength;
  this.y[i]=yin-sin(angle)*this.segLength;
  push();
  //strokeWeight(9);
  //stroke(205,51,51);
  translate(this.x[i],this.y[i],angle);
  rotate(angle);
 // line(0,0,this.segLength,0);
 if(i==0){
   push();
   fill(44);
   ellipse(0,0,this.segLength,this.segLength);
   pop();
  }
  else{
  ellipse(0,0,this.segLength/2,this.segLength/2);
  }
  pop();
}

}

function setup() {
//canvas=createCanvas(windowWidth,windowHeight);
canvas=createCanvas(400,400);
 canvas.position(0,0);
 createrandomlines();
/* camgraph=createCapture(VIDEO);
 camgraph.size(canvas.width,canvas.height);
 camgraph.hide();
 //camgraph.id("captured_video");
video=createGraphics(camgraph.width,camgraph.height);
  track=color(0,0,0);*/
   frameRate(60);
  myworm=new worm();
  myfield=new fieldsystem();
  myfield.createfield();
  mygarbage=new garbagesystem();
  /*let randomnum=Math.floor(random(1,10));
  for(let i=0;i<randomnum;i++){
    garbages.push(new garbage());
  }*/
  smooth();
}

/*function captureEvent( video){
  video.read();
}*/

function draw() {
  
  //tint(255, 127);
  background(255);
  //noisearea();
  randomlines();
  myfield.field(myworm);
  mygarbage.update();
  //push();
  //translate(width,0);
  //scale(-1,1);
  // tint(255, 127);
  //drawbackground(yesback);
  //drawmain(stop);
 // pop();
 myworm.render();
  showtext();
}

function drawbackground(yesback){
  video.push();
  video.translate(video.width,0);
  video.scale(-1,1);
  video.image(camgraph,0,0,camgraph.width,camgraph.height);
  video.pop();
 // video.loadPixels();
  if(yesback==1){
  image(video,0,0);
  }
}


/*function mousePressed(){
  video.loadPixels();
  let xx=domousex();
  let yy=domousey();
  let loc=xx+yy*video.width;
  track=color(video.pixels[loc]);
  nowx=xx;
  nowy=yy;
}*/

function domousex(){
  let dox=1280-mouseX;
  return dox;
}

function domousey(){
  let doy=mouseY;
  return doy;
}

function keyTyped(){
  if(key=='w'){
    yesback=1;
  }
  else if(key=='s'){
    yesback=0;
  }
  else if(key=='t'){
      stop=0;
      istrack="Track On";
      console.log("track");
    }
    else if(key=='f'){
      stop=1;
      istrack="Track Off";
      num=0;
      console.log("stop");
    }
  }
/*function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    camgraph.size(canvas.width,canvas.height);
    video.size(camgraph.width,camgraph.height);
  }*/
function drawmain(stop){
  if(stop==0){
    video.loadPixels();
    let closestx=600;
    let closesty=300;
    let record=99999;
    for(let x=0;x<video.width;x++){
      for(let y=0;y<video.height;y++){
        let loc=x+y*video.width;
        let current=color(video.pixels[loc]);
        let r1=red(current);
        let g1=green(current);
        let b1=blue(current);
        let r2=red(track);
        let g2=green(track);
        let b2=blue(current);
        let d=dist(r1,g1,b1,r2,b2,g2);
        if(d<record){
          record=d;
          closestx=x;
          closesty=y;
        }
      }
    }
    if(record<50&&abs(closestx-nowx)<=120&&abs(closesty-nowy)<=120){
      nowx=closestx;
      nowy=closesty;
    }
    else{
      nowx+=random(-5,5);
      nowy+=random(-5,5);
     }
     myworm.rendertrack(nowx,nowy);
       for(let i=0;i<garbages.length;i++){
         var one=garbages[i];
         one.update_killed(nowx,nowy);
         one.render();
         if(one.isdead()){
           garbages.splice(i);
           var addnum=Math.floor(random(1,max-garbages.length));
           for(let j=1;j<addnum;j++){
           garbages.push(new garbage());
           }
         }
       }
      }
  else if(stop==1){
        myworm.render();
      }
    }
function showtext(){
  push();
  textSize(18);
  noStroke();
  fill(0,102,153);
  text(istrack,10,10,150,50);
   text(count+mygarbage.solvenum,canvas.width-160,10,canvas.width-60,50);
   pop();
}
function noisearea(){
  //let redcolor=noise(zoff)*255;
 loadPixels();
  let xoff=0.0;
  for(let x=0;x<canvas.width;x++){
    let yoff=0.0;
    for(let y=0;y<canvas.height;y++){
      let bright=map(noise(xoff,yoff,zoff),0,1,0,255);
      //let dis=sqrt((mouseX-canvas.width/2)*(mouseX-canvas.width/2)+(mouseY-height/2)*(mouseY-height/2));
      //let center=map(dis,0,sqrt((canvas.width/2)*(canvas.width/2)+(canvas.height/2)*(canvas.height/2)),0,255);
      pixels[x+y*canvas.width]=color(100,bright,100);
      yoff+=0.01;
    }
    xoff+=0.01;
  }
 updatePixels();
  zoff+=0.03;
}
function createrandomlines(){
   let randomx=random(4,8);
   let randomy=random(4,8);
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
  myworm.location.x=mouseX;
  myworm.location.y=mouseY;
}