import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProduitService } from '../produit.service';
import { Produit } from '../model/produit.model';
import { Categorie } from '../model/categorie.model';
import { Image } from '../model/image.model';

@Component({
  selector: 'app-update-produit',
  templateUrl: './update-produit.component.html',
  styleUrls: ['./update-produit.component.css']
})
export class UpdateProduitComponent implements OnInit {

  currentProduit = new Produit();
  categories! : Categorie[];
  updatedCatId! : number;
  myImage! : string;
  uploadedImage!: File;
  isImageUpdated: Boolean=false;

  constructor(private activatedRoute: ActivatedRoute,
              private produitService: ProduitService,
              private router :Router) { }

  ngOnInit(): void {

      this.produitService.listeCategories(). subscribe(cats => {this.categories = cats; }); //this.categories = cats._embedded.categories pour SPRING REST;
      this.produitService.consulterProduit(this.activatedRoute.snapshot.params['id']).
      subscribe( prod=>{ this.currentProduit = prod;
                         this.updatedCatId = this.currentProduit.categorie.idCat;

      this.produitService 
      .loadImage(this.currentProduit.image.idImage) 
      .subscribe((img: Image) => {
         this.myImage = 'data:' + img.type + ';base64,' + img.image;
      });                   
                        
   } );
  
  }

  onImageUpload(event: any) {

     if (event.target.files && event.target.files.length) {
         this.uploadedImage = event.target.files[0];
         this.isImageUpdated = true; 
         const reader = new FileReader(); 
         reader.readAsDataURL(this.uploadedImage); 
         reader.onload = () => { 
          this.myImage = reader.result as string; }; 
        }
      }

  updateProduit() { 
    this.currentProduit.categorie = this.categories.
                              find(cat => cat.idCat == this.updatedCatId)!;

      if (this.isImageUpdated)
      {
        this.produitService 
        .uploadImage(this.uploadedImage, this.uploadedImage.name)
        .subscribe((img: Image) => { 
          this.currentProduit.image = img;
          this.produitService .updateProduit(this.currentProduit) 
          .subscribe((prod) => { 
            this.router.navigate(['produits']); 
          });
      });
      } 
      else{
        this.produitService 
        .updateProduit(this.currentProduit) 
        .subscribe((prod) => { 
          this.router.navigate(['produits']);
        });
      }                 
  }

}
