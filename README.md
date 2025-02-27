# Renforcement Full JS – Backend

## Initialiser le projet

1. **Cloner** le dépôt du backend :
   ```bash
   git clone https://github.com/MicleaChristian/Renforcement-full-js-back.git

2. Aller dans le dossier du projet :
   ```bash
   cd renforcement-full-js-back

3. lancer le serveur
   ```bash
   npm run go
Cela installera les dépendances et lancera directement le serveur

## Tester le projet/ routes

1.	Inscription
	•	Méthode : POST
	•	URL : /register
	•	Body (JSON) : { "username": "...", "password": "..." }
	2.	Connexion
	•	Méthode : POST
	•	URL : /login
	•	Body (JSON) : { "username": "...", "password": "..." }
	3.	Déconnexion
	•	Méthode : POST
	•	URL : /logout
	4.	Récupérer les tâches
	•	Méthode : GET
	•	URL : /tasks
	•	Description : Retourne la liste des tâches de l’utilisateur connecté.
	5.	Créer une tâche
	•	Méthode : POST
	•	URL : /tasks
	•	Body (JSON) :{"title": "Titre de la tâche", "description": "Description", "deadline": "2025-12-31"}
	6.	Modifier une tâche
	•	Méthode : PUT
	•	URL : /tasks/:id
	•	Body (JSON) :{ "title": "Nouveau titre", "description": "Nouvelle description", "deadline": "2025-12-31"}
	7.	Marquer une tâche comme terminée
	•	Méthode : PATCH
	•	URL : /tasks/:id/complete
	8.	Supprimer une tâche
	•	Méthode : DELETE
	•	URL : /tasks/:id

Toutes ces routes requièrent que l’utilisateur soit connecté (session).
