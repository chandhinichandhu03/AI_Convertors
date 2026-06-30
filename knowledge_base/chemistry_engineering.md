# Chemistry & Engineering Calculations

A reference for chemical balancing, thermodynamics, mechanics of materials, and CAD scaling units.

## 1. Chemistry Calculations & Laws
* **Equation Balancing**: Conservation of mass requires that the number of atoms of each element on the reactant side equals the product side.
  * *Example*: $2H_2 + O_2 \rightarrow 2H_2O$
* **Molar Mass**: Total mass of all atoms in a molecule (e.g., $H_2O = 2 \cdot 1.008 + 15.999 = 18.015 \, \text{g/mol}$).
* **pH Calculation**: Defined as the negative logarithm of the hydrogen ion concentration: $\text{pH} = -\log_{10}[H^+]$. pH < 7 is acidic, pH > 7 is basic, pH = 7 is neutral.
* **Ideal Gas Law**: $P \cdot V = n \cdot R \cdot T$ ($P$ is pressure, $V$ is volume, $n$ is moles, $R$ is gas constant $8.314 \, \text{J/(mol} \cdot \text{K)}$, $T$ is temperature).

## 2. Mechanical Engineering & Materials
* **Stress & Strain**:
  * **Stress ($\sigma$)**: Force divided by area, $\sigma = F / A$. SI unit is Pascal ($Pa$).
  * **Strain ($\epsilon$)**: Change in length divided by original length, $\epsilon = \Delta L / L_0$. Dimensionless ratio.
  * **Young's Modulus ($E$)**: Ratio of tensile stress to tensile strain, $E = \sigma / \epsilon$.
* **Torque & RPM**: Power of a motor is related to torque ($\tau$) and angular velocity ($\omega$ or RPM): $P = \tau \cdot \omega$. In practical units: $P \, \text{(kW)} = \frac{\tau \, \text{(N}\cdot\text{m)} \cdot N \, \text{(RPM)}}{9549}$.
* **Heat Transfer**: Fourier's Law of thermal conduction: $q = -k \cdot A \cdot \frac{dT}{dx}$.

## 3. Civil & Electrical Units
* **Civil Engineering Loads**: Dead loads (static self-weight), live loads (temporary occupancy weights), wind loads, seismic coefficients.
* **CAD Units Conversion**: Map between standard drawing units (millimeters, inches, feet, meters) when building drawing mesh objects (STL, OBJ, DXF).
