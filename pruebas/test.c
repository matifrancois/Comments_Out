	srand(time(NULL));
	unsigned int tickTemp;
	Sim* s;
	
 the mode 1 was chosen
	if (userData.mode == MODO1) {	

itialize Allegro. if there are errors, shows the message, returns -1 and finish the program.
		if (!iniciar_allegro()) {
			cout << "Failed to initialize Allegro\n";
			return -1;
		}

 create the simulation and initialize it with the values of userData.
		s = createSimulation(userData.robot_amount, userData.width, userData.height, userData.mode);
		
f it worked run the simulation
		if (s!=NULL){
ore the result on tickTemp
			freeSimulation(s, userData.mode);
			cout << "\nIt took " << tickTemp << " tick(s).\n" << endl;
		}

 it was not abble, shows the error message, and returns -1 finishing the program.
		else{
			cout << "Failed to create simulation.\n";
ee memory
			return -1;
		}
	}

 the mode 2 was chosen
	else{

		double timeTaken[MAX_ROBOTS] = { 0.0 };
		int m = 0, d;
		
 hacen dos iteraciones de 1000 simulaciones (1 robot y 2 robots) para iniciar con dos valores a comparar.
		while (m < 2) {

M_CANT (1000 por consigna) repeticiones.
			for (d = 0; d < SIM_CANT; d++) {

ea simulación.
				s = createSimulation(m + 1, userData.width, userData.height, userData.mode);
				
				/*Si la pudo crear, la simula y guarda el resultado en tickTemp.
				Suma el valor en la posición correspondiente de timeTaken y libera la simulación. */
				if (s != NULL) {
					tickTemp = simulate(s,userData.mode);
					timeTaken[m] += tickTemp;
					freeSimulation(s, userData.mode);
				}

				/*Si no pudo crear la simulación, muestra mensaje de error, libera la memoria y devuelve -1.
				Sale del programa. */
				else {
					cout << "Failed to create simulation.\n";
					freeSimulation(s,userData.mode);
					return -1;
				}
			}
			/*Terminan las SIM_CANT simulaciones con m+1 robots. 
			Se divide el resultado por la cantidad para sacar promedio. */
			timeTaken[m] /= SIM_CANT;

 muestra cuántos ticks tomó con m+1 robots y se incrementa contador.
			cout << m + 1 << " robots --- > " << timeTaken[m] << " tick(s)." << endl;
			m++;
		}