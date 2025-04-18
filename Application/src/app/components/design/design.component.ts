import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Konva from 'konva';
import { TranslateService, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CustomTotalPriceService } from '../../services/custome-total-price.service';

enum ShirtType {
  TShirt = 'tshirt',
  Hoodie = 'hoodie'
}

interface PriceBreakdown {
  base: number;
  text: number;
  logo: number;
  colorChange: number;
  total: number;
}

interface ShirtDesign {
  color: string;
  frontTextInput: string;
  backTextInput: string;
  rightSleeveTextInput: string;
  leftSleeveTextInput: string;
  frontTextColor: string;
  backTextColor: string;
  rightSleeveTextColor: string;
  leftSleeveTextColor: string;
  frontFontSize: number;
  backFontSize: number;
  rightSleeveFontSize: number;
  leftSleeveFontSize: number;
  frontFontFamily: string;
  backFontFamily: string;
  rightSleeveFontFamily: string;
  leftSleeveFontFamily: string;
  frontUploadedImages: string[];
  backUploadedImages: string[];
  rightSleeveUploadedImages: string[];
  leftSleeveUploadedImages: string[];
  frontIcons: string[];
  backIcons: string[];
  rightSleeveIcons: string[];
  leftSleeveIcons: string[];
  frontIconColors: string[];
  backIconColors: string[];
  rightSleeveIconColors: string[];
  leftSleeveIconColors: string[];
  priceBreakdown: PriceBreakdown; // Add price breakdown for each shirt type
}

@Component({
  selector: 'app-design',
  imports: [FormsModule, TranslateModule, TranslatePipe, CommonModule],
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.css'],
})
export class DesignComponent implements OnInit, OnDestroy {
  @ViewChild('frontStageContainer', { static: true }) frontStageContainer!: ElementRef;
  @ViewChild('backStageContainer', { static: true }) backStageContainer!: ElementRef;
  @ViewChild('rightSleeveStageContainer', { static: true }) rightSleeveStageContainer!: ElementRef;
  @ViewChild('leftSleeveStageContainer', { static: true }) leftSleeveStageContainer!: ElementRef;

  frontStage!: Konva.Stage;
  backStage!: Konva.Stage;
  rightSleeveStage!: Konva.Stage;
  leftSleeveStage!: Konva.Stage;

  frontShirtLayer!: Konva.Layer;
  backShirtLayer!: Konva.Layer;
  rightSleeveLayer!: Konva.Layer;
  leftSleeveLayer!: Konva.Layer;

  frontTextLayer!: Konva.Layer;
  backTextLayer!: Konva.Layer;
  rightSleeveTextLayer!: Konva.Layer;
  leftSleeveTextLayer!: Konva.Layer;

  frontLogoLayer!: Konva.Layer;
  backLogoLayer!: Konva.Layer;
  rightSleeveLogoLayer!: Konva.Layer;
  leftSleeveLogoLayer!: Konva.Layer;

  frontTextNode!: Konva.Text;
  backTextNode!: Konva.Text;
  rightSleeveTextNode!: Konva.Text;
  leftSleeveTextNode!: Konva.Text;

  frontUploadedImageNodes: Konva.Image[] = [];
  backUploadedImageNodes: Konva.Image[] = [];
  rightSleeveUploadedImageNodes: Konva.Image[] = [];
  leftSleeveUploadedImageNodes: Konva.Image[] = [];

  frontIconNodes: Konva.Text[] = [];
  backIconNodes: Konva.Text[] = [];
  rightSleeveIconNodes: Konva.Text[] = [];
  leftSleeveIconNodes: Konva.Text[] = [];

  frontTransformers: Konva.Transformer[] = [];
  backTransformers: Konva.Transformer[] = [];
  rightSleeveTransformers: Konva.Transformer[] = [];
  leftSleeveTransformers: Konva.Transformer[] = [];

  frontIconTransformers: Konva.Transformer[] = [];
  backIconTransformers: Konva.Transformer[] = [];
  rightSleeveIconTransformers: Konva.Transformer[] = [];
  leftSleeveIconTransformers: Konva.Transformer[] = [];

  currentShirtType: ShirtType = ShirtType.TShirt;
  ShirtType = ShirtType;
  currentView: 'front' | 'back' | 'right' | 'left' = 'front';

  availableIcons: string[] = [
    'fa-heart', 'fa-star', 'fa-smile', 'fa-thumbs-up', 'fa-rocket', 'fa-music',
    'fa-shopping-cart', 'fa-tshirt', 'fa-camera', 'fa-coffee', 'fa-paw', 'fa-tree',
    'fa-bolt', 'fa-globe', 'fa-gamepad', 'fa-sun', 'fa-moon', 'fa-bicycle', 'fa-plane', 'fa-gift',
    'fa-cat', 'fa-spider', 'fa-ghost', 'fa-truck', 'fa-motorcycle', 'fa-ice-cream',
    'fa-snowman', 'fa-robot', 'fa-graduation-cap', 'fa-dumbbell', 'fa-ranking-star',
    'fa-handshake', 'fa-snowflake', 'fa-mug-saucer', 'fa-key'
  ];

  designs: Record<ShirtType, ShirtDesign> = {
    [ShirtType.TShirt]: {
      color: '#000000',
      frontTextInput: '',
      backTextInput: '',
      rightSleeveTextInput: '',
      leftSleeveTextInput: '',
      frontTextColor: '#000000',
      backTextColor: '#000000',
      rightSleeveTextColor: '#000000',
      leftSleeveTextColor: '#000000',
      frontFontSize: 20,
      backFontSize: 20,
      rightSleeveFontSize: 20,
      leftSleeveFontSize: 20,
      frontFontFamily: 'Arial',
      backFontFamily: 'Arial',
      rightSleeveFontFamily: 'Arial',
      leftSleeveFontFamily: 'Arial',
      frontUploadedImages: [],
      backUploadedImages: [],
      rightSleeveUploadedImages: [],
      leftSleeveUploadedImages: [],
      frontIcons: [],
      backIcons: [],
      rightSleeveIcons: [],
      leftSleeveIcons: [],
      frontIconColors: [],
      backIconColors: [],
      rightSleeveIconColors: [],
      leftSleeveIconColors: [],
      priceBreakdown: {
        base: 20.00, // Base price for T-shirt
        text: 0,
        logo: 0,
        colorChange: 0,
        total: 20.00
      }
    },
    [ShirtType.Hoodie]: {
      color: '#000000',
      frontTextInput: '',
      backTextInput: '',
      rightSleeveTextInput: '',
      leftSleeveTextInput: '',
      frontTextColor: '#000000',
      backTextColor: '#000000',
      rightSleeveTextColor: '#000000',
      leftSleeveTextColor: '#000000',
      frontFontSize: 20,
      backFontSize: 20,
      rightSleeveFontSize: 20,
      leftSleeveFontSize: 20,
      frontFontFamily: 'Arial',
      backFontFamily: 'Arial',
      rightSleeveFontFamily: 'Arial',
      leftSleeveFontFamily: 'Arial',
      frontUploadedImages: [],
      backUploadedImages: [],
      rightSleeveUploadedImages: [],
      leftSleeveUploadedImages: [],
      frontIcons: [],
      backIcons: [],
      rightSleeveIcons: [],
      leftSleeveIcons: [],
      frontIconColors: [],
      backIconColors: [],
      rightSleeveIconColors: [],
      leftSleeveIconColors: [],
      priceBreakdown: {
        base: 25.00, // Base price for Hoodie
        text: 0,
        logo: 0,
        colorChange: 0,
        total: 25.00
      }
    }
  };

  currentLanguage: string = 'en';
  private langChangeSubscription!: Subscription;

  constructor(private translate: TranslateService,private router:Router, private totalPriceService:CustomTotalPriceService) {
    this.currentLanguage = this.translate.currentLang || 'en';
  }

  ngOnInit() {
    this.initializeKonva();
    this.langChangeSubscription = this.translate.onLangChange.subscribe((event) => {
      this.currentLanguage = event.lang;
    });
  }

  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  initializeKonva() {
    this.frontStage = new Konva.Stage({ container: this.frontStageContainer.nativeElement, width: 400, height: 420 });
    this.backStage = new Konva.Stage({ container: this.backStageContainer.nativeElement, width: 400, height: 420 });
    this.rightSleeveStage = new Konva.Stage({ container: this.rightSleeveStageContainer.nativeElement, width: 400, height: 420 });
    this.leftSleeveStage = new Konva.Stage({ container: this.leftSleeveStageContainer.nativeElement, width: 400, height: 420 });
    this.loadCurrentDesign();
  }

  loadCurrentDesign() {
    this.initializeShirtLayer(this.frontStage, 'front');
    this.initializeShirtLayer(this.backStage, 'back');
    this.initializeShirtLayer(this.rightSleeveStage, 'right');
    this.initializeShirtLayer(this.leftSleeveStage, 'left');
  }

  initializeShirtLayer(stage: Konva.Stage, view: 'front' | 'back' | 'right' | 'left') {
    const shirtLayer = new Konva.Layer();
    const textLayer = new Konva.Layer();
    const logoLayer = new Konva.Layer();
    stage.add(shirtLayer);
    stage.add(textLayer);
    stage.add(logoLayer);

    const basePath = this.currentShirtType === ShirtType.TShirt ? '/shirts/' : '/hoodies/';
    const design = this.designs[this.currentShirtType];

    const imageObj = new Image();
    imageObj.src = view === 'front' ? `${basePath}front.png` :
      view === 'back' ? `${basePath}back.png` :
      view === 'right' ? `${basePath}right.png` :
      `${basePath}left.png`;

    imageObj.onload = () => {
      const shirtImage = new Konva.Image({ x: 50, y: 50, image: imageObj, width: 300, height: 300 });
      shirtLayer.add(shirtImage);
      this.applyColorToShirt(shirtImage, shirtLayer, design.color);
      shirtLayer.draw();

      if (view === 'front') {
        this.frontShirtLayer = shirtLayer;
        this.frontTextLayer = textLayer;
        this.frontLogoLayer = logoLayer;
      } else if (view === 'back') {
        this.backShirtLayer = shirtLayer;
        this.backTextLayer = textLayer;
        this.backLogoLayer = logoLayer;
      } else if (view === 'right') {
        this.rightSleeveLayer = shirtLayer;
        this.rightSleeveTextLayer = textLayer;
        this.rightSleeveLogoLayer = logoLayer;
      } else {
        this.leftSleeveLayer = shirtLayer;
        this.leftSleeveTextLayer = textLayer;
        this.leftSleeveLogoLayer = logoLayer;
      }

      const SHIRT_LEFT = 50;
      const SHIRT_TOP = 80;
      const SHIRT_WIDTH = 300;
      const SHIRT_HEIGHT = 300;
      const TEXT_MAX_WIDTH = 140;
      const TEXT_MAX_HEIGHT = 50;
      const MOVABLE_AREA = { x: SHIRT_LEFT, y: SHIRT_TOP, width: SHIRT_WIDTH / 2, height: SHIRT_HEIGHT };

      const textNode = new Konva.Text({
        x: SHIRT_LEFT + 30,
        y: SHIRT_TOP + 100,
        text: view === 'front' ? design.frontTextInput :
          view === 'back' ? design.backTextInput :
          view === 'right' ? design.rightSleeveTextInput :
          design.leftSleeveTextInput,
        fontSize: view === 'front' ? design.frontFontSize :
          view === 'back' ? design.backFontSize :
          view === 'right' ? design.rightSleeveFontSize :
          design.leftSleeveFontSize,
        fill: view === 'front' ? design.frontTextColor :
          view === 'back' ? design.backTextColor :
          view === 'right' ? design.rightSleeveTextColor :
          design.leftSleeveTextColor,
        fontFamily: view === 'front' ? design.frontFontFamily :
          view === 'back' ? design.backFontFamily :
          view === 'right' ? design.rightSleeveFontFamily :
          design.leftSleeveFontFamily,
        width: TEXT_MAX_WIDTH,
        height: TEXT_MAX_HEIGHT,
        align: 'center',
        draggable: true,
      });

      textNode.on('dragmove', () => {
        const minX = MOVABLE_AREA.x;
        const maxX = MOVABLE_AREA.x + MOVABLE_AREA.width + 200 - textNode.width();
        const minY = MOVABLE_AREA.y;
        const maxY = MOVABLE_AREA.y + MOVABLE_AREA.height - 160 - textNode.height();
        textNode.position({
          x: Math.max(minX, Math.min(textNode.x(), maxX)),
          y: Math.max(minY, Math.min(textNode.y(), maxY))
        });
        textLayer.draw();
      });

      textLayer.add(textNode);
      textLayer.draw();

      if (view === 'front') this.frontTextNode = textNode;
      else if (view === 'back') this.backTextNode = textNode;
      else if (view === 'right') this.rightSleeveTextNode = textNode;
      else this.leftSleeveTextNode = textNode;

      const uploadedImages = view === 'front' ? design.frontUploadedImages :
        view === 'back' ? design.backUploadedImages :
        view === 'right' ? design.rightSleeveUploadedImages :
        design.leftSleeveUploadedImages;
      uploadedImages.forEach(image => this.loadUploadedImage(image, view));

      const icons = view === 'front' ? design.frontIcons :
        view === 'back' ? design.backIcons :
        view === 'right' ? design.rightSleeveIcons :
        design.leftSleeveIcons;
      icons.forEach(icon => this.loadIcon(icon, view));
    };
  }

  switchShirtType(type: ShirtType) {
    this.currentShirtType = type;
    this.frontStage.destroyChildren();
    this.backStage.destroyChildren();
    this.rightSleeveStage.destroyChildren();
    this.leftSleeveStage.destroyChildren();
    this.resetKonvaReferences();
    this.loadCurrentDesign();
    this.switchView('front');
    this.updateTextPrice();
    this.updateLogoPrice();
    this.updateColorPrice();
  }

  resetKonvaReferences() {
    this.frontTextNode = null!;
    this.backTextNode = null!;
    this.rightSleeveTextNode = null!;
    this.leftSleeveTextNode = null!;
    this.frontUploadedImageNodes = [];
    this.backUploadedImageNodes = [];
    this.rightSleeveUploadedImageNodes = [];
    this.leftSleeveUploadedImageNodes = [];
    this.frontIconNodes = [];
    this.backIconNodes = [];
    this.rightSleeveIconNodes = [];
    this.leftSleeveIconNodes = [];
    this.frontTransformers = [];
    this.backTransformers = [];
    this.rightSleeveTransformers = [];
    this.leftSleeveTransformers = [];
    this.frontIconTransformers = [];
    this.backIconTransformers = [];
    this.rightSleeveIconTransformers = [];
    this.leftSleeveIconTransformers = [];
  }

  applyColorToShirt(shirtImage: Konva.Image, shirtLayer: Konva.Layer, color: string) {
    const rgb = this.hexToRgb(color);
    if (rgb && shirtImage) {
      shirtImage.cache();
      shirtImage.filters([Konva.Filters.RGBA]);
      shirtImage.red(rgb[0]);
      shirtImage.green(rgb[1]);
      shirtImage.blue(rgb[2]);
      shirtLayer.draw();
    }
    this.updateColorPrice();
  }

  hexToRgb(hex: string): [number, number, number] | null {
    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)) return null;
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  }

  updateShirtColor(color: string) {
    const design = this.designs[this.currentShirtType];
    design.color = color;
    this.applyColorToShirt(this.frontShirtLayer.getChildren()[0] as Konva.Image, this.frontShirtLayer, color);
    this.applyColorToShirt(this.backShirtLayer.getChildren()[0] as Konva.Image, this.backShirtLayer, color);
    this.applyColorToShirt(this.rightSleeveLayer.getChildren()[0] as Konva.Image, this.rightSleeveLayer, color);
    this.applyColorToShirt(this.leftSleeveLayer.getChildren()[0] as Konva.Image, this.leftSleeveLayer, color);
  }

  get textInput(): string {
    const design = this.designs[this.currentShirtType];
    return this.currentView === 'front' ? design.frontTextInput :
      this.currentView === 'back' ? design.backTextInput :
      this.currentView === 'right' ? design.rightSleeveTextInput :
      design.leftSleeveTextInput;
  }

  set textInput(value: string) {
    const design = this.designs[this.currentShirtType];
    if (this.currentView === 'front') design.frontTextInput = value;
    else if (this.currentView === 'back') design.backTextInput = value;
    else if (this.currentView === 'right') design.rightSleeveTextInput = value;
    else design.leftSleeveTextInput = value;
    this.updateTextSettings();
    this.updateTextPrice();
  }

  get textColor(): string {
    const design = this.designs[this.currentShirtType];
    return this.currentView === 'front' ? design.frontTextColor :
      this.currentView === 'back' ? design.backTextColor :
      this.currentView === 'right' ? design.rightSleeveTextColor :
      design.leftSleeveTextColor;
  }

  set textColor(value: string) {
    const design = this.designs[this.currentShirtType];
    if (this.currentView === 'front') design.frontTextColor = value;
    else if (this.currentView === 'back') design.backTextColor = value;
    else if (this.currentView === 'right') design.rightSleeveTextColor = value;
    else design.leftSleeveTextColor = value;
    this.updateTextSettings();
  }

  get fontSize(): number {
    const design = this.designs[this.currentShirtType];
    return this.currentView === 'front' ? design.frontFontSize :
      this.currentView === 'back' ? design.backFontSize :
      this.currentView === 'right' ? design.rightSleeveFontSize :
      design.leftSleeveFontSize;
  }

  set fontSize(value: number) {
    const design = this.designs[this.currentShirtType];
    if (this.currentView === 'front') design.frontFontSize = value;
    else if (this.currentView === 'back') design.backFontSize = value;
    else if (this.currentView === 'right') design.rightSleeveFontSize = value;
    else design.leftSleeveFontSize = value;
    this.updateTextSettings();
  }

  get fontFamily(): string {
    const design = this.designs[this.currentShirtType];
    return this.currentView === 'front' ? design.frontFontFamily :
      this.currentView === 'back' ? design.backFontFamily :
      this.currentView === 'right' ? design.rightSleeveFontFamily :
      design.leftSleeveFontFamily;
  }

  set fontFamily(value: string) {
    const design = this.designs[this.currentShirtType];
    if (this.currentView === 'front') design.frontFontFamily = value;
    else if (this.currentView === 'back') design.backFontFamily = value;
    else if (this.currentView === 'right') design.rightSleeveFontFamily = value;
    else design.leftSleeveFontFamily = value;
    this.updateTextSettings();
  }

  get iconColor(): string {
    const design = this.designs[this.currentShirtType];
    const colors = this.currentView === 'front' ? design.frontIconColors :
      this.currentView === 'back' ? design.backIconColors :
      this.currentView === 'right' ? design.rightSleeveIconColors :
      design.leftSleeveIconColors;
    return colors.length > 0 ? colors[colors.length - 1] : '#000000';
  }

  set iconColor(value: string) {
    const design = this.designs[this.currentShirtType];
    const colors = this.currentView === 'front' ? design.frontIconColors :
      this.currentView === 'back' ? design.backIconColors :
      this.currentView === 'right' ? design.rightSleeveIconColors :
      design.leftSleeveIconColors;
    if (colors.length > 0) {
      colors[colors.length - 1] = value;
    }
    this.updateIconSettings();
  }

  updateTextSettings() {
    const design = this.designs[this.currentShirtType];
    if (this.currentView === 'front' && this.frontTextNode) {
      this.frontTextNode.text(design.frontTextInput);
      this.frontTextNode.fontSize(design.frontFontSize);
      this.frontTextNode.fill(design.frontTextColor);
      this.frontTextNode.fontFamily(design.frontFontFamily);
      this.frontTextLayer.draw();
    } else if (this.currentView === 'back' && this.backTextNode) {
      this.backTextNode.text(design.backTextInput);
      this.backTextNode.fontSize(design.backFontSize);
      this.backTextNode.fill(design.backTextColor);
      this.backTextNode.fontFamily(design.backFontFamily);
      this.backTextLayer.draw();
    } else if (this.currentView === 'right' && this.rightSleeveTextNode) {
      this.rightSleeveTextNode.text(design.rightSleeveTextInput);
      this.rightSleeveTextNode.fontSize(design.rightSleeveFontSize);
      this.rightSleeveTextNode.fill(design.rightSleeveTextColor);
      this.rightSleeveTextNode.fontFamily(design.rightSleeveFontFamily);
      this.rightSleeveTextLayer.draw();
    } else if (this.currentView === 'left' && this.leftSleeveTextNode) {
      this.leftSleeveTextNode.text(design.leftSleeveTextInput);
      this.leftSleeveTextNode.fontSize(design.leftSleeveFontSize);
      this.leftSleeveTextNode.fill(design.leftSleeveTextColor);
      this.leftSleeveTextNode.fontFamily(design.leftSleeveFontFamily);
      this.leftSleeveTextLayer.draw();
    }
  }

  updateIconSettings() {
    const design = this.designs[this.currentShirtType];
    if (this.currentView === 'front' && this.frontIconNodes.length > 0) {
      this.frontIconNodes.forEach((node, index) => {
        node.fill(design.frontIconColors[index] || '#000000');
      });
      this.frontLogoLayer.draw();
    } else if (this.currentView === 'back' && this.backIconNodes.length > 0) {
      this.backIconNodes.forEach((node, index) => {
        node.fill(design.backIconColors[index] || '#000000');
      });
      this.backLogoLayer.draw();
    } else if (this.currentView === 'right' && this.rightSleeveIconNodes.length > 0) {
      this.rightSleeveIconNodes.forEach((node, index) => {
        node.fill(design.rightSleeveIconColors[index] || '#000000');
      });
      this.rightSleeveLogoLayer.draw();
    } else if (this.currentView === 'left' && this.leftSleeveIconNodes.length > 0) {
      this.leftSleeveIconNodes.forEach((node, index) => {
        node.fill(design.leftSleeveIconColors[index] || '#000000');
      });
      this.leftSleeveLogoLayer.draw();
    }
  }

  switchView(view: 'front' | 'back' | 'right' | 'left') {
    this.currentView = view;
    this.frontStageContainer.nativeElement.style.display = view === 'front' ? 'block' : 'none';
    this.backStageContainer.nativeElement.style.display = view === 'back' ? 'block' : 'none';
    this.rightSleeveStageContainer.nativeElement.style.display = view === 'right' ? 'block' : 'none';
    this.leftSleeveStageContainer.nativeElement.style.display = view === 'left' ? 'block' : 'none';
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageData = e.target.result;
        const design = this.designs[this.currentShirtType];
        if (this.currentView === 'front') design.frontUploadedImages.push(imageData);
        else if (this.currentView === 'back') design.backUploadedImages.push(imageData);
        else if (this.currentView === 'right') design.rightSleeveUploadedImages.push(imageData);
        else design.leftSleeveUploadedImages.push(imageData);
        this.loadUploadedImage(imageData, this.currentView);
        this.updateLogoPrice();
      };
      reader.readAsDataURL(input.files[0]);
      input.value = '';
    }
  }

  loadUploadedImage(imageData: string, view: 'front' | 'back' | 'right' | 'left') {
    const imageObj = new Image();
    imageObj.src = imageData;
    imageObj.onload = () => {
      const currentStage = view === 'front' ? this.frontStage :
        view === 'back' ? this.backStage :
        view === 'right' ? this.rightSleeveStage :
        this.leftSleeveStage;

      const currentLogoLayer = view === 'front' ? this.frontLogoLayer :
        view === 'back' ? this.backLogoLayer :
        view === 'right' ? this.rightSleeveLogoLayer :
        this.leftSleeveLogoLayer;

      const currentUploadedImageNodes = view === 'front' ? this.frontUploadedImageNodes :
        view === 'back' ? this.backUploadedImageNodes :
        view === 'right' ? this.rightSleeveUploadedImageNodes :
        this.leftSleeveUploadedImageNodes;

      const currentTransformers = view === 'front' ? this.frontTransformers :
        view === 'back' ? this.backTransformers :
        view === 'right' ? this.rightSleeveTransformers :
        this.leftSleeveTransformers;

      const MOVABLE_AREA = { x: 50, y: 50, width: 100, height: 300 };
      const uploadedImageNode = new Konva.Image({
        x: 150 + (currentUploadedImageNodes.length * 10),
        y: 150 + (currentUploadedImageNodes.length * 10),
        image: imageObj,
        width: 100,
        height: 100,
        draggable: true,
      });

      currentLogoLayer.add(uploadedImageNode);
      currentUploadedImageNodes.push(uploadedImageNode);

      const transformer = new Konva.Transformer({
        nodes: [uploadedImageNode],
        enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
        rotateEnabled: true,
        boundBoxFunc: (oldBox, newBox) => {
          if (newBox.width < 20 || newBox.height < 20) return oldBox;
          return newBox;
        }
      });

      currentLogoLayer.add(transformer);
      transformer.visible(true);
      currentTransformers.push(transformer);

      uploadedImageNode.on('dragmove', () => {
        const minX = MOVABLE_AREA.x;
        const maxX = MOVABLE_AREA.x + MOVABLE_AREA.width + 200 - uploadedImageNode.width();
        const minY = MOVABLE_AREA.y;
        const maxY = MOVABLE_AREA.y + MOVABLE_AREA.height - 160 - uploadedImageNode.height();
        uploadedImageNode.position({
          x: Math.max(minX, Math.min(uploadedImageNode.x(), maxX)),
          y: Math.max(minY, Math.min(uploadedImageNode.y(), maxY)),
        });
        currentLogoLayer.draw();
      });

      uploadedImageNode.on('click', () => {
        currentTransformers.forEach(t => t.visible(false));
        transformer.visible(true);
        currentLogoLayer.draw();
      });

      currentStage.on('click', (e) => {
        if (e.target !== uploadedImageNode) {
          transformer.visible(false);
          currentLogoLayer.draw();
        }
      });

      currentLogoLayer.draw();
    };
  }

  selectIcon(icon: string) {
    const design = this.designs[this.currentShirtType];
    if (this.currentView === 'front') {
      design.frontIcons.push(icon);
      design.frontIconColors.push('#000000');
    } else if (this.currentView === 'back') {
      design.backIcons.push(icon);
      design.backIconColors.push('#000000');
    } else if (this.currentView === 'right') {
      design.rightSleeveIcons.push(icon);
      design.rightSleeveIconColors.push('#000000');
    } else {
      design.leftSleeveIcons.push(icon);
      design.leftSleeveIconColors.push('#000000');
    }
    this.loadIcon(icon, this.currentView);
    this.updateLogoPrice();
  }

  loadIcon(icon: string, view: 'front' | 'back' | 'right' | 'left') {
    const currentStage = view === 'front' ? this.frontStage :
      view === 'back' ? this.backStage :
      view === 'right' ? this.rightSleeveStage :
      this.leftSleeveStage;

    const currentLogoLayer = view === 'front' ? this.frontLogoLayer :
      view === 'back' ? this.backLogoLayer :
      view === 'right' ? this.rightSleeveLogoLayer :
      this.leftSleeveLogoLayer;

    const currentIconNodes = view === 'front' ? this.frontIconNodes :
      view === 'back' ? this.backIconNodes :
      view === 'right' ? this.rightSleeveIconNodes :
      this.leftSleeveIconNodes;

    const currentIconTransformers = view === 'front' ? this.frontIconTransformers :
      view === 'back' ? this.backIconTransformers :
      view === 'right' ? this.rightSleeveIconTransformers :
      this.leftSleeveIconTransformers;

    const design = this.designs[this.currentShirtType];
    const iconColors = view === 'front' ? design.frontIconColors :
      view === 'back' ? design.backIconColors :
      view === 'right' ? design.rightSleeveIconColors :
      design.leftSleeveIconColors;

    const MOVABLE_AREA = { x: 50, y: 50, width: 100, height: 300 };
    const iconNode = new Konva.Text({
      x: 150 + (currentIconNodes.length * 10),
      y: 150 + (currentIconNodes.length * 10),
      text: String.fromCharCode(parseInt(this.getIconUnicode(icon), 16)),
      fontFamily: 'FontAwesome',
      fontSize: 50,
      fill: iconColors[iconColors.length - 1] || '#000000',
      draggable: true,
    });

    currentLogoLayer.add(iconNode);
    currentIconNodes.push(iconNode);

    const transformer = new Konva.Transformer({
      nodes: [iconNode],
      enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      rotateEnabled: true,
      boundBoxFunc: (oldBox, newBox) => {
        if (newBox.width < 20 || newBox.height < 20) return oldBox;
        return newBox;
      }
    });

    currentLogoLayer.add(transformer);
    transformer.visible(true);
    currentIconTransformers.push(transformer);

    iconNode.on('dragmove', () => {
      const minX = MOVABLE_AREA.x;
      const maxX = MOVABLE_AREA.x + MOVABLE_AREA.width + 200 - iconNode.width();
      const minY = MOVABLE_AREA.y;
      const maxY = MOVABLE_AREA.y + MOVABLE_AREA.height - 160 - iconNode.height();
      iconNode.position({
        x: Math.max(minX, Math.min(iconNode.x(), maxX)),
        y: Math.max(minY, Math.min(iconNode.y(), maxY)),
      });
      currentLogoLayer.draw();
    });

    iconNode.on('click', () => {
      currentIconTransformers.forEach(t => t.visible(false));
      transformer.visible(true);
      currentLogoLayer.draw();
    });

    currentStage.on('click', (e) => {
      if (e.target !== iconNode) {
        transformer.visible(false);
        currentLogoLayer.draw();
      }
    });

    currentLogoLayer.draw();
  }

  getIconUnicode(iconClass: string): string {
    const iconMap: { [key: string]: string } = {
      'fa-heart': 'f004',
      'fa-star': 'f005',
      'fa-smile': 'f118',
      'fa-thumbs-up': 'f164',
      'fa-rocket': 'f135',
      'fa-music': 'f001',
      'fa-shopping-cart': 'f07a',
      'fa-tshirt': 'f553',
      'fa-camera': 'f030',
      'fa-coffee': 'f0f4',
      'fa-paw': 'f1b0',
      'fa-tree': 'f1bb',
      'fa-bolt': 'f0e7',
      'fa-globe': 'f0ac',
      'fa-gamepad': 'f11b',
      'fa-sun': 'f185',
      'fa-moon': 'f186',
      'fa-bicycle': 'f206',
      'fa-plane': 'f072',
      'fa-gift': 'f06b',
      'fa-cat': 'f6be',
      'fa-spider': 'f717',
      'fa-ghost': 'f6e2',
      'fa-truck': 'f0d1',
      'fa-motorcycle': 'f21c',
      'fa-ice-cream': 'f810',
      'fa-snowman': 'f7d0',
      'fa-robot': 'f544',
      'fa-graduation-cap': 'f19d',
      'fa-dumbbell': 'f44b',
      'fa-ranking-star': 'e535',
      'fa-handshake': 'f2b5',
      'fa-snowflake': 'f2dc',
      'fa-mug-saucer': 'f0f4',
      'fa-key': 'f084'
    };
    return iconMap[iconClass] || 'f004';
  }

  deleteLogo() {
    const design = this.designs[this.currentShirtType];
    if (this.currentView === 'front') {
      design.frontUploadedImages = [];
      design.frontIcons = [];
      design.frontIconColors = [];
      this.frontUploadedImageNodes.forEach(node => node.destroy());
      this.frontIconNodes.forEach(node => node.destroy());
      this.frontTransformers.forEach(t => t.destroy());
      this.frontIconTransformers.forEach(t => t.destroy());
      this.frontUploadedImageNodes = [];
      this.frontIconNodes = [];
      this.frontTransformers = [];
      this.frontIconTransformers = [];
      this.frontLogoLayer.draw();
    } else if (this.currentView === 'back') {
      design.backUploadedImages = [];
      design.backIcons = [];
      design.backIconColors = [];
      this.backUploadedImageNodes.forEach(node => node.destroy());
      this.backIconNodes.forEach(node => node.destroy());
      this.backTransformers.forEach(t => t.destroy());
      this.backIconTransformers.forEach(t => t.destroy());
      this.backUploadedImageNodes = [];
      this.backIconNodes = [];
      this.backTransformers = [];
      this.backIconTransformers = [];
      this.backLogoLayer.draw();
    } else if (this.currentView === 'right') {
      design.rightSleeveUploadedImages = [];
      design.rightSleeveIcons = [];
      design.rightSleeveIconColors = [];
      this.rightSleeveUploadedImageNodes.forEach(node => node.destroy());
      this.rightSleeveIconNodes.forEach(node => node.destroy());
      this.rightSleeveTransformers.forEach(t => t.destroy());
      this.rightSleeveIconTransformers.forEach(t => t.destroy());
      this.rightSleeveUploadedImageNodes = [];
      this.rightSleeveIconNodes = [];
      this.rightSleeveTransformers = [];
      this.rightSleeveIconTransformers = [];
      this.rightSleeveLogoLayer.draw();
    } else {
      design.leftSleeveUploadedImages = [];
      design.leftSleeveIcons = [];
      design.leftSleeveIconColors = [];
      this.leftSleeveUploadedImageNodes.forEach(node => node.destroy());
      this.leftSleeveIconNodes.forEach(node => node.destroy());
      this.leftSleeveTransformers.forEach(t => t.destroy());
      this.leftSleeveIconTransformers.forEach(t => t.destroy());
      this.leftSleeveUploadedImageNodes = [];
      this.leftSleeveIconNodes = [];
      this.leftSleeveTransformers = [];
      this.leftSleeveIconTransformers = [];
      this.leftSleeveLogoLayer.draw();
    }
    this.updateLogoPrice();
  }

  updateTextPrice() {
    const design = this.designs[this.currentShirtType];
    let totalTextPrice = 0;
    const textAreas = [
      design.frontTextInput,
      design.backTextInput,
      design.rightSleeveTextInput,
      design.leftSleeveTextInput
    ];
    textAreas.forEach(text => {
      if (text && text.length > 0) totalTextPrice += 5.00 + (text.length * 0.10);
    });
    design.priceBreakdown.text = totalTextPrice;
    this.calculateTotal();
  }

  updateLogoPrice() {
    const design = this.designs[this.currentShirtType];
    let logoCount = 0;
    logoCount += design.frontUploadedImages.length + design.frontIcons.length;
    logoCount += design.backUploadedImages.length + design.backIcons.length;
    logoCount += design.rightSleeveUploadedImages.length + design.rightSleeveIcons.length;
    logoCount += design.leftSleeveUploadedImages.length + design.leftSleeveIcons.length;
    design.priceBreakdown.logo = logoCount * 8.00;
    this.calculateTotal();
  }

  updateColorPrice() {
    const design = this.designs[this.currentShirtType];
    design.priceBreakdown.colorChange = design.color !== '#000000' ? 3.00 : 0;
    this.calculateTotal();
  }

  calculateTotal() {
    const design = this.designs[this.currentShirtType];
    design.priceBreakdown.total = design.priceBreakdown.base +
      design.priceBreakdown.text +
      design.priceBreakdown.logo +
      design.priceBreakdown.colorChange;
  }

  saveDesign() {
    const prefix = this.currentShirtType === ShirtType.TShirt ? 'tshirt' : 'hoodie';
    const frontDataURL = this.frontStage.toDataURL();
    const backDataURL = this.backStage.toDataURL();
    const rightSleeveDataURL = this.rightSleeveStage.toDataURL();
    const leftSleeveDataURL = this.leftSleeveStage.toDataURL();
    this.downloadImage(frontDataURL, `${prefix}-front-design.png`);
    this.downloadImage(backDataURL, `${prefix}-back-design.png`);
    this.downloadImage(rightSleeveDataURL, `${prefix}-right-sleeve-design.png`);
    this.downloadImage(leftSleeveDataURL, `${prefix}-left-sleeve-design.png`);
  }

  private downloadImage(dataURL: string, filename: string) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataURL;
    link.click();
  }
  onOrderClick() {
    const totalPrice = this.designs[this.currentShirtType].priceBreakdown.total;
    this.totalPriceService.changeTotalPrice(totalPrice);
    this.router.navigate(['/customeOrder']);
  }
}