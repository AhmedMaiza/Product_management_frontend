import { Component, OnInit } from '@angular/core';
import { Produit } from '../model/produit.model';
import { ProduitService } from '../produit.service';
import { Categorie } from '../model/categorie.model';
import { Image } from '../model/image.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent implements OnInit {

  produits: Produit[];
  nomProduit!: string;
  IdCategorie!: number;
  categories!: Categorie[];
  searchTerm!: string;
  constructor(private produitService: ProduitService) { }

  ngOnInit(): void {
    this.chargerProduits();
    this.produitService.listeCategories().
      subscribe(cats => {
        this.categories = cats;
        console.log(cats);
      }
      );
  }

  chargerProduits() {
    this.produitService.listeProduit().subscribe(prods => {
      console.log(prods);
      this.produits = prods;
      this.produits.forEach((prod) => {
         this.produitService 
         .loadImage(prod.image.idImage) 
         .subscribe((img: Image) => { 
           prod.imageStr = 'data:' + img.type + ';base64,' + img.image; 
        });
      });
    });
  }

  supprimerProduit(p: Produit) {
    Swal.fire({
      title: 'Confirmation',
      text: 'Êtes-vous sûr de vouloir supprimer ce Produit ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result.isConfirmed) {
        this.produitService.supprimerProduit(p.idProduit).subscribe(() => {
          console.log("produit supprimé");
          this.chargerProduits();
        });
      }
    });
  }

  rechercherProds() {
    this.produitService.rechercherParNom(this.nomProduit).
      subscribe(prods => {
        this.produits = prods;
        this.produits.forEach((prod) => {
          this.produitService 
          .loadImage(prod.image.idImage) 
          .subscribe((img: Image) => { 
            prod.imageStr = 'data:' + img.type + ';base64,' + img.image; 
         });
       });
      });
      
  }

  onChange() {
    this.produitService.rechercherParCategorie(this.IdCategorie).
      subscribe(prods => { this.produits = prods
        this.produits.forEach((prod) => {
          this.produitService 
          .loadImage(prod.image.idImage) 
          .subscribe((img: Image) => { 
            prod.imageStr = 'data:' + img.type + ';base64,' + img.image; 
         });
       });
      });

  }


}
