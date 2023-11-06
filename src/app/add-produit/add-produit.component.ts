import { Component, OnInit } from '@angular/core';
import { Produit } from '../model/produit.model';
import { ProduitService } from '../produit.service';
import { Categorie } from '../model/categorie.model';
import { Router} from '@angular/router';
import { Image } from '../model/image.model';

@Component({
  selector: 'app-add-produit',
  templateUrl: './add-produit.component.html',
  styleUrls: ['./add-produit.component.css']
})
export class AddProduitComponent implements OnInit {

  categories! : Categorie[];
  newIdCat! : number;
  newCategorie! : Categorie;
  newProduit = new Produit();

  uploadedImage!: File;
  imagePath: any;

  constructor(private produitService: ProduitService,private router :Router) { }

  ngOnInit(): void {
    this.produitService.listeCategories().
    subscribe(cats => {this.categories = cats;  //this.categories = cats._embedded.categories pour SPRING REST;
                        console.log(cats);
    });
  }

  addProduit() {
    /*this.newProduit.categorie = this.categories.find(cat => cat.idCat == this.newIdCat)!;
    this.produitService.ajouterProduit(this.newProduit)
     .subscribe(prod => { 
      console.log(prod);
      this.router.navigate(['produits']);
    }
  );*/
    this.produitService
      .uploadImage(this.uploadedImage, this.uploadedImage.name)
      .subscribe((img: Image) => {
        this.newProduit.image = img;
        this.newProduit.categorie = this.categories.find(cat => cat.idCat == this.newIdCat)!;

        this.produitService
          .ajouterProduit(this.newProduit)
          .subscribe(() => {
            this.router.navigate(['produits']);
          });
      });
  }

  onImageUpload(event: any) {
     this.uploadedImage = event.target.files[0];
     var reader = new FileReader();
     reader.readAsDataURL(this.uploadedImage);
     reader.onload = (_event) => { this.imagePath = reader.result; }
  }

}
