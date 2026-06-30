import math
import re
from typing import Dict, Any, List, Optional
import sympy as sp

# Helper for Roman Numerals
ROMAN_MAP = [
    (1000, 'M'), (900, 'CM'), (500, 'D'), (400, 'CD'),
    (100, 'C'), (90, 'XC'), (50, 'L'), (40, 'XL'),
    (10, 'X'), (9, 'IX'), (5, 'V'), (4, 'IV'), (1, 'I')
]

def int_to_roman(num: int) -> str:
    if num <= 0:
        return "N/A"
    roman = ""
    for val, ch in ROMAN_MAP:
        while num >= val:
            roman += ch
            num -= val
    return roman

def roman_to_int(s: str) -> int:
    s = s.upper().strip()
    roman_dict = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
    val = 0
    for i in range(len(s)):
        if i > 0 and roman_dict[s[i]] > roman_dict[s[i-1]]:
            val += roman_dict[s[i]] - 2 * roman_dict[s[i-1]]
        else:
            val += roman_dict[s[i]]
    return val

# --- Chemical Balancer Helper ---
def parse_chemical_formula(formula: str) -> Dict[str, int]:
    """Parses chemical formulas like H2O or Ca(OH)2 into element counts."""
    # Handle parentheses
    def expand_parens(match):
        sub_formula = match.group(1)
        mult = int(match.group(2) or 1)
        expanded = ""
        for el, count in re.findall(r'([A-Z][a-z]*)(\d*)', sub_formula):
            c = int(count or 1) * mult
            expanded += f"{el}{c}"
        return expanded
        
    formula = re.sub(r'\((.*?)\)(\d*)', expand_parens, formula)
    
    element_counts = {}
    for el, count in re.findall(r'([A-Z][a-z]*)(\d*)', formula):
        c = int(count or 1)
        element_counts[el] = element_counts.get(el, 0) + c
    return element_counts

def balance_chemical_equation(equation: str) -> Dict[str, Any]:
    """Balances equations like H2 + O2 -> H2O using linear algebra."""
    try:
        equation = equation.replace(" ", "")
        reactants_str, products_str = equation.split("->")
        reactants = reactants_str.split("+")
        products = products_str.split("+")
        
        # Get list of all unique elements
        elements = set()
        reactant_compositions = []
        for r in reactants:
            comp = parse_chemical_formula(r)
            reactant_compositions.append(comp)
            elements.update(comp.keys())
            
        product_compositions = []
        for p in products:
            comp = parse_chemical_formula(p)
            product_compositions.append(comp)
            elements.update(comp.keys())
            
        elements = sorted(list(elements))
        num_reactants = len(reactants)
        num_products = len(products)
        num_elements = len(elements)
        
        # Setup linear equation system: reactants - products = 0
        import numpy as np
        A = []
        for el in elements:
            row = []
            for comp in reactant_compositions:
                row.append(comp.get(el, 0))
            for comp in product_compositions:
                row.append(-comp.get(el, 0))
            A.append(row)
            
        # Solve using null space / symbolic math to get integer coefficients
        A_matrix = sp.Matrix(A)
        null_space = A_matrix.nullspace()
        
        if not null_space:
            return {"error": "Equation cannot be balanced or has no unique solution."}
            
        # Take the first null space vector
        coeffs_vector = null_space[0]
        # Multiply by LCM of denominators to get integers
        denominators = [c.q for c in coeffs_vector]
        lcm_val = 1
        for d in denominators:
            lcm_val = math.lcm(lcm_val, d)
            
        integer_coeffs = [int(abs(c * lcm_val)) for c in coeffs_vector]
        
        # Format the balanced equation
        react_part = []
        for i, r in enumerate(reactants):
            coeff = integer_coeffs[i]
            coeff_str = "" if coeff == 1 else str(coeff)
            react_part.append(f"{coeff_str}{r}")
            
        prod_part = []
        for i, p in enumerate(products):
            coeff = integer_coeffs[num_reactants + i]
            coeff_str = "" if coeff == 1 else str(coeff)
            prod_part.append(f"{coeff_str}{p}")
            
        balanced_str = " + ".join(react_part) + " -> " + " + ".join(prod_part)
        return {
            "balancedEquation": balanced_str,
            "coefficients": integer_coeffs,
            "success": True
        }
    except Exception as e:
        return {"error": f"Chemical balancing failed: {e}"}

# --- Core Calculation Service ---

def solve_mathematics_conversion(problem_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
    """Solves mathematical problems symbolically using SymPy."""
    try:
        # 1. Symbolic Derivatives
        if problem_type == "derivative":
            expr_str = data.get("expression", "x**2")
            var_str = data.get("variable", "x")
            x = sp.Symbol(var_str)
            expr = sp.sympify(expr_str)
            deriv = sp.diff(expr, x)
            return {
                "input": expr_str,
                "result": str(deriv),
                "latex": sp.latex(deriv),
                "steps": f"Differentiating {expr_str} with respect to {var_str}."
            }
            
        # 2. Symbolic Integrals
        elif problem_type == "integral":
            expr_str = data.get("expression", "x**2")
            var_str = data.get("variable", "x")
            x = sp.Symbol(var_str)
            expr = sp.sympify(expr_str)
            
            # Definite vs Indefinite
            is_definite = "lower" in data and "upper" in data
            if is_definite:
                lower = float(data["lower"])
                upper = float(data["upper"])
                integral = sp.integrate(expr, (x, lower, upper))
                steps = f"Evaluating definite integral of {expr_str} from {lower} to {upper}."
            else:
                integral = sp.integrate(expr, x)
                steps = f"Computing indefinite integral of {expr_str} with respect to {var_str}."
                
            return {
                "input": expr_str,
                "result": str(integral),
                "latex": sp.latex(integral),
                "steps": steps
            }
            
        # 3. Limits
        elif problem_type == "limit":
            expr_str = data.get("expression", "sin(x)/x")
            var_str = data.get("variable", "x")
            target_str = data.get("target", "0")
            x = sp.Symbol(var_str)
            expr = sp.sympify(expr_str)
            
            # Check target limits (infinity is 'oo')
            if target_str == "oo" or target_str == "inf":
                target = sp.oo
            elif target_str == "-oo" or target_str == "-inf":
                target = -sp.oo
            else:
                target = sp.sympify(target_str)
                
            lim = sp.limit(expr, x, target)
            return {
                "input": f"limit({expr_str}, {var_str} -> {target_str})",
                "result": str(lim),
                "latex": sp.latex(lim),
                "steps": f"Evaluating limit as {var_str} approaches {target_str}."
            }
            
        # 4. Matrices
        elif problem_type == "matrix":
            matrix_a = data.get("matrixA", [])
            matrix_b = data.get("matrixB", [])
            op = data.get("operation", "multiply")
            
            A = sp.Matrix(matrix_a)
            if op == "determinant":
                det = A.det()
                return {"result": str(det), "latex": sp.latex(det)}
            elif op == "transpose":
                trans = A.T
                return {"result": trans.tolist(), "latex": sp.latex(trans)}
            elif op == "inverse":
                inv = A.inv()
                return {"result": inv.tolist(), "latex": sp.latex(inv)}
            elif op == "multiply":
                B = sp.Matrix(matrix_b)
                prod = A * B
                return {"result": prod.tolist(), "latex": sp.latex(prod)}
                
        # 5. Equation Solvers
        elif problem_type == "solve_equations":
            eqs_str = data.get("equations", [])  # List of equations e.g. ["x + y - 5", "x - y - 1"]
            vars_str = data.get("variables", ["x", "y"])
            
            symbols = [sp.Symbol(v) for v in vars_str]
            equations = [sp.sympify(eq) for eq in eqs_str]
            solutions = sp.solve(equations, symbols)
            
            # Format output
            res_str = ""
            if isinstance(solutions, dict):
                res_str = ", ".join([f"{k} = {v}" for k, v in solutions.items()])
            else:
                res_str = str(solutions)
                
            return {
                "result": res_str,
                "latex": sp.latex(solutions),
                "steps": "Solving system of symbolic algebraic equations."
            }
            
        # 6. Boolean Simplify
        elif problem_type == "boolean_simplify":
            expr_str = data.get("expression", "A & (B | ~A)")
            expr = sp.sympify(expr_str)
            simplified = sp.simplify_logic(expr)
            return {
                "input": expr_str,
                "result": str(simplified),
                "latex": sp.latex(simplified)
            }
            
        # 7. Number base conversions / Roman Numerals
        elif problem_type == "base_conversion":
            val = data.get("value", "")
            base_from = int(data.get("baseFrom", 10))
            base_to = int(data.get("baseTo", 10))
            
            # Handle Roman numerals
            if base_from == 0:  # 0 indicates Roman
                dec_val = roman_to_int(val)
            else:
                dec_val = int(val, base_from)
                
            if base_to == 0:
                result = int_to_roman(dec_val)
            elif base_to == 2:
                result = bin(dec_val)[2:]
            elif base_to == 8:
                result = oct(dec_val)[2:]
            elif base_to == 16:
                result = hex(dec_val)[2:].upper()
            else:
                result = str(dec_val)
                
            return {"result": result, "decimalValue": dec_val}
            
        # Default algebraic simplifier fallback
        else:
            expr_str = data.get("expression", "x**2 + 2*x + 1")
            expr = sp.sympify(expr_str)
            result = sp.simplify(expr)
            return {
                "result": str(result),
                "latex": sp.latex(result)
            }
    except Exception as e:
        return {"error": f"Math engine exception: {e}"}

def solve_physics_conversion(problem_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
    """Calculates physics parameters, outputs dimensional analysis, derivations, and SI units."""
    try:
        # 1. Force
        if problem_type == "force":
            m = float(data["mass"])
            a = float(data["acceleration"])
            f = m * a
            return {
                "result": f"{f} N",
                "siUnits": "Newton (kg * m / s^2)",
                "dimensionalAnalysis": "[M L T^-2]",
                "formula": "F = m * a",
                "derivation": "Force represents the rate of change of momentum over time. Since momentum p = m * v, Force F = dp/dt = d(mv)/dt = m * (dv/dt) = m * a."
            }
            
        # 2. Torque
        elif problem_type == "torque":
            r = float(data["radius"])
            f = float(data["force"])
            theta = float(data.get("angle", 90))
            torque = r * f * math.sin(math.radians(theta))
            return {
                "result": f"{torque:.4f} N*m",
                "siUnits": "Newton-meter (N * m)",
                "dimensionalAnalysis": "[M L^2 T^-2]",
                "formula": "Torque = r * F * sin(theta)",
                "derivation": "Torque is the rotational equivalent of linear force. It is computed as the vector cross product of the position vector and the force vector: tau = r x F."
            }
            
        # 3. Energy / Power
        elif problem_type == "energy_power":
            power = float(data.get("power", 0))
            time = float(data.get("time", 0))
            if power and time:
                energy = power * time
                return {
                    "result": f"{energy} Joules",
                    "siUnits": "Joule (J = Watt * s)",
                    "dimensionalAnalysis": "[M L^2 T^-2]",
                    "formula": "E = P * t",
                    "derivation": "Energy is the capacity to perform work. Power is the rate of energy dissipation: P = dE/dt, which integrates to E = P * t for constant power."
                }
                
        # 4. Wave velocity
        elif problem_type == "wave_frequency":
            freq = float(data.get("frequency", 100))
            wavelength = float(data.get("wavelength", 3))
            velocity = freq * wavelength
            return {
                "result": f"{velocity} m/s",
                "siUnits": "meters per second (m/s)",
                "dimensionalAnalysis": "[L T^-1]",
                "formula": "v = f * lambda",
                "derivation": "The velocity of a wave is the product of its cycle rate (frequency) and the spatial length of a single cycle (wavelength)."
            }
            
        return {"error": "Unsupported physics problem category."}
    except Exception as e:
        return {"error": f"Physics solver failed: {e}"}

def solve_chemistry_conversion(problem_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
    """Chemical equation balancing, molar mass, and pH calculation."""
    # 1. Equation Balancing
    if problem_type == "equation_balancer":
        eq = data.get("equation", "H2 + O2 -> H2O")
        return balance_chemical_equation(eq)
        
    # 2. pH solver
    elif problem_type == "ph_level":
        try:
            h_conc = float(data["hConcentration"])
            ph = -math.log10(h_conc)
            status = "Acidic" if ph < 7.0 else ("Basic" if ph > 7.0 else "Neutral")
            return {
                "ph": round(ph, 4),
                "acidityStatus": status,
                "formula": "pH = -log10[H+]"
            }
        except Exception as e:
            return {"error": f"pH Calculation failed: {e}"}
            
    # 3. Molar Mass solver
    elif problem_type == "molar_mass":
        formula = data.get("formula", "H2O").strip()
        # Atomic weights database
        atomic_weights = {
            'H': 1.008, 'He': 4.0026, 'Li': 6.94, 'Be': 9.0122, 'B': 10.81,
            'C': 12.011, 'N': 14.007, 'O': 15.999, 'F': 18.998, 'Ne': 20.180,
            'Na': 22.990, 'Mg': 24.305, 'Al': 26.982, 'Si': 28.085, 'P': 30.974,
            'S': 32.06, 'Cl': 35.45, 'Ar': 39.948, 'K': 39.098, 'Ca': 40.078,
            'Fe': 55.845, 'Cu': 63.546, 'Zn': 65.38, 'Ag': 107.87, 'I': 126.90
        }
        try:
            counts = parse_chemical_formula(formula)
            total_mass = 0.0
            element_breakdown = {}
            for el, count in counts.items():
                w = atomic_weights.get(el, 12.0)  # Default weight to Carbon if unknown
                total_mass += w * count
                element_breakdown[el] = round(w * count, 3)
            return {
                "formula": formula,
                "molarMass": round(total_mass, 4),
                "breakdown": element_breakdown,
                "unit": "g/mol"
            }
        except Exception as e:
            return {"error": f"Molar mass solver failed: {e}"}
            
    return {"error": "Unsupported chemistry problem category."}

def solve_engineering_conversion(problem_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
    """Stress/Strain properties, torque RPM conversions, and CAD units scaling."""
    try:
        # 1. Stress / Strain / Young Modulus
        if problem_type == "stress_strain":
            force = float(data.get("force", 0))
            area = float(data.get("area", 0))
            change_len = float(data.get("changeLength", 0))
            orig_len = float(data.get("originalLength", 0))
            
            stress = force / area if area else 0.0
            strain = change_len / orig_len if orig_len else 0.0
            young_modulus = stress / strain if strain else 0.0
            
            return {
                "stress": f"{stress:.4f} Pa (N/m^2)",
                "strain": f"{strain:.6f} (Dimensionless)",
                "youngModulus": f"{young_modulus:.4f} Pa",
                "formulae": {
                    "stress": "sigma = F / A",
                    "strain": "epsilon = delta_L / L0",
                    "youngModulus": "E = sigma / epsilon"
                }
            }
            
        # 2. RPM & Torque Power
        elif problem_type == "rpm_torque_power":
            rpm = float(data.get("rpm", 0))
            torque = float(data.get("torque", 0))
            # Power in kW = (Torque * RPM) / 9549
            power_kw = (torque * rpm) / 9549
            return {
                "powerKw": round(power_kw, 4),
                "powerHp": round(power_kw * 1.34102, 4),
                "formula": "Power (kW) = (Torque * RPM) / 9549"
            }
            
        return {"error": "Unsupported engineering category."}
    except Exception as e:
        return {"error": f"Engineering solver failed: {e}"}

# --- Unit Converter Matrices ---
UNIT_MATRIX: Dict[str, Dict[str, float]] = {
    "length": {
        "meter": 1.0, "kilometer": 0.001, "centimeter": 100.0, "millimeter": 1000.0,
        "inch": 39.3701, "foot": 3.28084, "yard": 1.09361, "mile": 0.000621371,
        "astronomical_unit": 6.68459e-12, "light_year": 1.057e-16
    },
    "weight": {
        "kilogram": 1.0, "gram": 1000.0, "milligram": 1e6,
        "pound": 2.20462, "ounce": 35.274, "stone": 0.157473, "ton": 0.00110231
    },
    "temperature": {
        # Custom handlings for offset conversions
        "celsius": 1.0, "kelvin": 1.0, "fahrenheit": 1.0
    },
    "currency": {
        # Offline manual conversion rates (Base USD)
        "usd": 1.0, "eur": 0.92, "gbp": 0.78, "inr": 83.50, "jpy": 160.20,
        "cny": 7.25, "cad": 1.37, "aud": 1.50
    },
    "digital_storage": {
        "byte": 1.0, "kilobyte": 1e-3, "megabyte": 1e-6, "gigabyte": 1e-9, "terabyte": 1e-12,
        "kibibyte": 1/1024.0, "mebibyte": 1/1048576.0, "gibibyte": 1/1073741824.0
    }
}

def convert_units_custom(val: float, category: str, unit_from: str, unit_to: str) -> Dict[str, Any]:
    """Performs unit scaling matching Imperial, SI, temperature offsets, and manual exchange rates."""
    category = category.lower().strip()
    unit_from = unit_from.lower().strip()
    unit_to = unit_to.lower().strip()
    
    # Custom temperature translations
    if category == "temperature":
        c_val = val
        if unit_from == "fahrenheit":
            c_val = (val - 32) * 5/9
        elif unit_from == "kelvin":
            c_val = val - 273.15
            
        result = c_val
        if unit_to == "fahrenheit":
            result = (c_val * 9/5) + 32
        elif unit_to == "kelvin":
            result = c_val + 273.15
        return {"result": result, "success": True}
        
    cat_matrix = UNIT_MATRIX.get(category)
    if not cat_matrix or unit_from not in cat_matrix or unit_to not in cat_matrix:
        # General standard numeric fallbacks if category lacks matrix details
        return {"result": val, "success": True}
        
    # Scale base
    base_val = val / cat_matrix[unit_from]
    result = base_val * cat_matrix[unit_to]
    return {
        "result": result,
        "success": True
    }
