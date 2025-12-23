package com.carboncalc.util;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class CarbonCalculator {

    // Emission factors (kg CO2 per unit)
    private static final Map<String, Double> EMISSION_FACTORS = new HashMap<>();

    static {
        // Transportation (per km)
        EMISSION_FACTORS.put("car_petrol", 0.192);
        EMISSION_FACTORS.put("car_diesel", 0.171);
        EMISSION_FACTORS.put("car_electric", 0.053);
        EMISSION_FACTORS.put("bus", 0.089);
        EMISSION_FACTORS.put("train", 0.041);
        EMISSION_FACTORS.put("flight_short", 0.255);
        EMISSION_FACTORS.put("flight_long", 0.195);

        // Energy (per kWh)
        EMISSION_FACTORS.put("electricity", 0.233);
        EMISSION_FACTORS.put("natural_gas", 0.185);

        // Food (per kg)
        EMISSION_FACTORS.put("beef", 27.0);
        EMISSION_FACTORS.put("pork", 12.1);
        EMISSION_FACTORS.put("chicken", 6.9);
        EMISSION_FACTORS.put("fish", 6.1);
        EMISSION_FACTORS.put("vegetables", 2.0);
    }

    public Double calculateEmission(String activityType, Double amount) {
        Double factor = EMISSION_FACTORS.getOrDefault(activityType, 1.0);
        return amount * factor;
    }

    public Map<String, Double> getEmissionFactors() {
        return new HashMap<>(EMISSION_FACTORS);
    }
}
