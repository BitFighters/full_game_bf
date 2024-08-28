/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import JoystickController from "joystick-controller"
import { checkIpad } from "../../utils/systemInfo";

class Joystick{
    public static outerRadius: number = 50;
    public static innerRadius: number = 35;
    public static isTouched: boolean = false;
    private static staticJoystick: any;
    private static buttons: any;
    public static MoveController(orientation:string,listener:any){
        const isIpad = checkIpad();
        this.outerRadius = isIpad ? 75 : 50;
        this.innerRadius = isIpad ? 50 : 35;
        let topx = isIpad ? "84%" : "83%";
        let topy = isIpad ? "17%" : "20%";
        if(orientation == "portrait"){
            topx = isIpad ? "80%" : "65%";
            topy = isIpad ? "15%" : "15%";
        }
        this.staticJoystick = new JoystickController(
            {
                maxRange: 80,
                level: 10,
                radius: Joystick.outerRadius,
                joystickRadius: Joystick.innerRadius,
                opacity: 1,
                leftToRight: false,
                bottomToUp: true,
                containerClass: "joystick-container",
                controllerClass: "joystick-controller",
                joystickClass: "joystick",
                distortion: true,
                x: topx,
                y: topy,
                mouseClickButton: "MIDDLE",
                hideContextMenu: false,
                zIndex: 1,
            },
            (data: any) => {
                Joystick.isTouched = true;
                listener(data);
            }
        );
    }
    public static ShootController(scene:Phaser.Scene,orientation:string,listener:any){
        const width = scene.sys.game.canvas.clientWidth
        const height = scene.sys.game.canvas.clientHeight
        const isIpad = checkIpad();
        
        this.buttons = [];

        const punch = scene.add.image(0,0,'joyA').setOrigin(0.5).setScrollFactor(0)
        punch.setScale(75/punch.displayHeight).setAlpha(0.8)
        punch.x = width * 0.90 - punch.displayWidth * 0.5;
        punch.y = height * 0.94 - punch.displayHeight * 0.5;
        punch.setInteractive();
        punch.addListener(Phaser.Input.Events.POINTER_DOWN,()=>{
            listener({punch:true,kick:false});
        });

        const kick = scene.add.image(0,0,'joyB').setOrigin(0.5).setScrollFactor(0)
        kick.setScale(75/kick.displayHeight).setAlpha(0.8)
        kick.x = punch.x + Math.floor(kick.displayWidth * 1.1);
        kick.y = punch.y;
        kick.setInteractive();
        kick.addListener(Phaser.Input.Events.POINTER_DOWN,()=>{
            listener({punch:false,kick:true});
        });

        this.buttons.push(punch);
        this.buttons.push(kick);

        if(orientation == "portrait"){
            this.buttons[0].x = width * (isIpad ? 0.68 : 0.85) - this.buttons[0].displayWidth * 0.5;
            this.buttons[0].y = height * (isIpad ? 0.68 : 0.92) - this.buttons[0].displayHeight * 0.5;

            this.buttons[1].x = width * (isIpad ? 0.68 : 0.85) - this.buttons[0].displayWidth * 0.5;
            this.buttons[1].y = this.buttons[0].y + this.buttons[1].displayHeight * 1;
        }else{
            this.buttons[0].x = width * (isIpad ? 0.68 : 0.90) - this.buttons[0].displayWidth * 0.5;
            this.buttons[0].y = height * (isIpad ? 0.70 : 0.94) - this.buttons[0].displayHeight * 0.5;

            this.buttons[1].x = this.buttons[0].x + Math.floor(this.buttons[1].displayWidth * 1.1);
            this.buttons[1].y = this.buttons[0].y;
        }
    }
    public static destroy(){
        if(this.staticJoystick)
            this.staticJoystick!.destroy();
        if(this.buttons){
            this.buttons.forEach((btn:any)=>{
                if(btn)
                    btn.destroy(true);
            })
        }
    }
}

export default Joystick