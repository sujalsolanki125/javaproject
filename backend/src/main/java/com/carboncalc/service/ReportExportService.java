package com.carboncalc.service;

import com.carboncalc.dto.AnalyticsReportDTO;
import com.carboncalc.entity.User;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.StringWriter;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;

/**
 * Report Export Service
 * Exports analytics reports to PDF and CSV formats
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ReportExportService {

    private final AnalyticsService analyticsService;

    /**
     * Export weekly report as PDF
     */
    public byte[] exportWeeklyReportPDF(User user, LocalDate startDate) throws IOException {
        AnalyticsReportDTO report = analyticsService.generateWeeklyReport(user, startDate);
        return generatePDF(report, user);
    }

    /**
     * Export monthly report as PDF
     */
    public byte[] exportMonthlyReportPDF(User user, LocalDate startDate) throws IOException {
        AnalyticsReportDTO report = analyticsService.generateMonthlyReport(user, startDate);
        return generatePDF(report, user);
    }

    /**
     * Export weekly report as CSV
     */
    public String exportWeeklyReportCSV(User user, LocalDate startDate) throws IOException {
        AnalyticsReportDTO report = analyticsService.generateWeeklyReport(user, startDate);
        return generateCSV(report, user);
    }

    /**
     * Export monthly report as CSV
     */
    public String exportMonthlyReportCSV(User user, LocalDate startDate) throws IOException {
        AnalyticsReportDTO report = analyticsService.generateMonthlyReport(user, startDate);
        return generateCSV(report, user);
    }

    /**
     * Generate PDF document from report
     */
    private byte[] generatePDF(AnalyticsReportDTO report, User user) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        try {
            // Title
            document.add(new Paragraph("Carbon Footprint Report")
                    .setFontSize(20)
                    .setBold());

            // User info
            document.add(new Paragraph("User: " + user.getUsername()));
            document.add(new Paragraph("Report Type: " + report.getReportType()));
            document.add(new Paragraph(String.format("Period: %s to %s",
                    report.getStartDate().format(DateTimeFormatter.ISO_DATE),
                    report.getEndDate().format(DateTimeFormatter.ISO_DATE))));
            document.add(new Paragraph("\n"));

            // Summary
            document.add(new Paragraph("Summary").setFontSize(16).setBold());
            document.add(new Paragraph(String.format("Total Emissions: %.2f kg CO2e", report.getTotalEmissions())));
            document.add(
                    new Paragraph(String.format("Average Daily: %.2f kg CO2e", report.getAverageDailyEmissions())));
            document.add(new Paragraph(String.format("Carbon Points: %d", report.getCarbonPointsEarned())));
            document.add(new Paragraph("\n"));

            // Category breakdown table
            document.add(new Paragraph("Emissions by Category").setFontSize(16).setBold());
            Table categoryTable = new Table(2);
            categoryTable.addHeaderCell("Category");
            categoryTable.addHeaderCell("Emissions (kg CO2e)");

            report.getCategoryBreakdown().forEach((category, emissions) -> {
                categoryTable.addCell(category);
                categoryTable.addCell(String.format("%.2f", emissions));
            });
            document.add(categoryTable);
            document.add(new Paragraph("\n"));

            // Recommendation
            document.add(new Paragraph("Recommendation").setFontSize(16).setBold());
            document.add(new Paragraph(report.getRecommendation()));

        } finally {
            document.close();
        }

        return baos.toByteArray();
    }

    /**
     * Generate CSV from report
     */
    private String generateCSV(AnalyticsReportDTO report, User user) throws IOException {
        StringWriter sw = new StringWriter();
        CSVPrinter csvPrinter = new CSVPrinter(sw, CSVFormat.DEFAULT
                .withHeader("Metric", "Value"));

        try {
            // Report metadata
            csvPrinter.printRecord("User", user.getUsername());
            csvPrinter.printRecord("Report Type", report.getReportType());
            csvPrinter.printRecord("Start Date", report.getStartDate());
            csvPrinter.printRecord("End Date", report.getEndDate());
            csvPrinter.printRecord("", "");

            // Summary
            csvPrinter.printRecord("Total Emissions (kg CO2e)", report.getTotalEmissions());
            csvPrinter.printRecord("Average Daily (kg CO2e)", report.getAverageDailyEmissions());
            csvPrinter.printRecord("Carbon Points", report.getCarbonPointsEarned());
            csvPrinter.printRecord("Goals Achieved", report.getGoalsAchieved());
            csvPrinter.printRecord("Badges Unlocked", report.getBadgesUnlocked());
            csvPrinter.printRecord("", "");

            // Category breakdown
            csvPrinter.printRecord("Category", "Emissions (kg CO2e)");
            for (Map.Entry<String, Double> entry : report.getCategoryBreakdown().entrySet()) {
                csvPrinter.printRecord(entry.getKey(), entry.getValue());
            }
            csvPrinter.printRecord("", "");

            // Trend analysis
            csvPrinter.printRecord("Period", "Emissions (kg CO2e)");
            for (Map.Entry<String, Double> entry : report.getTrendAnalysis().entrySet()) {
                csvPrinter.printRecord(entry.getKey(), entry.getValue());
            }

        } finally {
            csvPrinter.flush();
            csvPrinter.close();
        }

        return sw.toString();
    }
}
