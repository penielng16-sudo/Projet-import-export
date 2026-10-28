// Jeu de données local de démonstration : il remplace temporairement une réponse serveur pour rendre le tableau visible sans API.
const parcels = [
  { reference: "CI-005-D1", sender: "ABDOUL KARIM SOUMAHORO", recipient: "ABDOUL KARIM SOUMAHORO", status: "Livré", statusClass: "badge-delivered", payment: "Payé" },
  { reference: "CI-004-D1", sender: "LÉA MARIE", recipient: "ABDOUL KARIM SOUMAHORO", status: "Livré", statusClass: "badge-delivered", payment: "Payé" },
  { reference: "CI-003-D1", sender: "ABDOUL KARIM SOUMAHORO", recipient: "MARC GUEHI", status: "En transit", statusClass: "badge-new", payment: "Payé" },
  { reference: "CI-002-D1", sender: "Jean", recipient: "Awa", status: "En transit", statusClass: "badge-new", payment: "Payé" },
  { reference: "CI-001-D1", sender: "Jean Dupont", recipient: "Aya Koné", status: "Nouveau", statusClass: "badge-neutral", payment: "Payé" },
]; // Chaque objet correspond à un colis; ses propriétés alimentent les cellules de la ligne générée.

const rows = document.querySelector("#parcel-rows"); // Recherche une fois le corps du tableau afin d’y injecter les lignes sans reconstruire le reste du document.
const toast = document.querySelector("#toast"); // Garde une référence vers la région de notification réutilisée par toutes les actions.
let toastTimer; // Stocke l’identifiant du minuteur courant pour pouvoir remplacer proprement une notification précédente.

parcels.forEach((parcel) => { // Produit une ligne par colis, ce qui évite de maintenir manuellement du HTML répétitif.
  const row = document.createElement("tr"); // Construit un élément <tr> conforme à la structure du tableau avant de le remplir.
  row.innerHTML = `
    <td>${parcel.reference}</td>
    <td><span class="people"><strong>${parcel.sender}</strong><span>→ ${parcel.recipient}</span></span></td>
    <td>Paris → Abidjan</td>
    <td><span class="badge table-badge ${parcel.statusClass}">${parcel.status}</span></td>
    <td><span class="badge table-badge badge-delivered">${parcel.payment}</span></td>`; // Injecte les champs du colis dans les cellules prévues; les classes CSS distinguent visuellement les statuts.
  rows.append(row); // Insère la ligne terminée dans le DOM, où le navigateur l’affiche dans le tableau.
});

function showMessage(message) { // Centralise les notifications afin que chaque bouton fournisse un retour cohérent sans changer de page.
  toast.textContent = message; // textContent traite le texte comme du contenu brut et évite d’interpréter une chaîne comme du balisage HTML.
  toast.classList.add("visible"); // Ajoute la classe pilotant l’opacité et le déplacement définis dans la feuille CSS.
  window.clearTimeout(toastTimer); // Empêche un ancien délai de masquer trop tôt une notification qui vient d’être remplacée.
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 2800); // Programme le retrait de la classe après un délai lisible; la transition CSS anime ensuite la disparition.
}

document.querySelector("#new-parcel").addEventListener("click", () => { // Enregistre un gestionnaire de clic pour connecter le contrôle à son retour de démonstration.
  showMessage("Nouveau colis : formulaire de création à connecter."); // Indique la prochaine étape fonctionnelle : le formulaire doit être relié à un stockage ou à une API.
});

document.querySelector("#logout").addEventListener("click", () => { // Branche le bouton sur un gestionnaire pour signaler explicitement la limite de cette maquette.
  showMessage("Déconnexion : cette maquette ne dispose pas de compte connecté."); // Aucun mécanisme d’authentification n’étant présent, le clic affiche un message au lieu de prétendre déconnecter un compte.
});

const menuButton = document.querySelector("#mobile-menu"); // Récupère le contrôle qui commande l’ouverture et la fermeture du menu sur petit écran.
const sidebar = document.querySelector("#sidebar"); // La classe open de cet élément pilote son déplacement hors champ ou dans l’écran via CSS.
const closeMenuButton = document.querySelector("#close-menu"); // Bouton de fermeture dédié, accessible à l’intérieur du tiroir mobile.

function closeMenu() { // Centralise la fermeture visuelle et la mise à jour de l’état accessible.
  sidebar.classList.remove("open"); // Retire la classe qui affiche le tiroir.
  menuButton.setAttribute("aria-expanded", "false"); // Annonce que le menu est refermé aux technologies d’assistance.
}

menuButton.addEventListener("click", () => { // Utilise un événement de clic, compatible souris, clavier et activation tactile du bouton natif.
  const isOpen = sidebar.classList.toggle("open"); // toggle ajoute ou retire open et renvoie le nouvel état pour synchroniser l’accessibilité.
  menuButton.setAttribute("aria-expanded", String(isOpen)); // aria-expanded reflète l’état réel du tiroir pour les technologies d’assistance.
});

closeMenuButton.addEventListener("click", closeMenu); // Ferme le menu lorsque l’utilisateur touche le bouton ×.

document.addEventListener("keydown", (event) => { // Permet aussi de fermer le tiroir avec le clavier.
  if (event.key === "Escape" && sidebar.classList.contains("open")) closeMenu(); // Échap ferme uniquement un menu actuellement ouvert.
});

document.addEventListener("click", (event) => { // Ferme le tiroir après un clic ou toucher dans la zone extérieure.
  if (sidebar.classList.contains("open") && !sidebar.contains(event.target) && !menuButton.contains(event.target)) closeMenu(); // Ignore le bouton d’ouverture et les clics dans le menu.
});

sidebar.querySelectorAll(".nav-link").forEach((link) => { // Applique le même gestionnaire à tous les liens, sans code dupliqué pour chaque entrée.
  link.addEventListener("click", () => { // Met à jour l’interface dès qu’un lien d’ancre est activé.
    sidebar.querySelector(".nav-link.active")?.classList.remove("active"); // L’opérateur ?. évite une erreur si aucun lien n’est actif au départ.
    link.classList.add("active"); // Marque le lien sélectionné; les règles CSS affichent alors son état actif.
    closeMenu(); // Referme le tiroir et synchronise aria-expanded après le choix d’une destination.
  });
});
